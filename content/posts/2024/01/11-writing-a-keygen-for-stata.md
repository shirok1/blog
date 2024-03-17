---
date: 2024-01-11
---

# Writing a Keygen for Stata

I encountered 2 courses that require Stata in my major this semester, namely Regression Analysis and Selected Topics on Statistical Methods. Stata is a proprietary statistical software, and it is not *free*.

![Stata's student pricing](/img/stata-student-pricing.png)

You can see that they're *really* asking for a lot, and it's not even perpetual. Before you mention that students can apply for a free license, I did apply for it, but I got this in reply:

> Thank you for your interest in Stata.
>
> However, we are unable to provide an evaluation license. Harbin Institute of Technology was recently added to the US Dept of Commerce BIS Entity List. Therefore, we are unable to sell and provide licenses to you.

...well, the fact that they can't *legitimately* provide me a license means that I can *legitimately* pirate it, right?

![Stata about](/img/stata-about.png)

## Looking for samples

I searched for cracked versions of Stata on the Internet; most of the results were on Windows only, and they required patches to be applied to the executable. Official downloads require a registered account and have a limit on download counts. I eventually discovered a stock version of Stata 17 for macOS, as well as several keys. The first key was invalidated after an online update, but the second one survived. I also discovered that the key labeled for Stata 18 works with Stata 17.

After having a working Stata 17, I figured out how to *upgrade* my Stata to 18, by downloading offline update bundles from <https://www.stata.com/support/updates/>, and tweaking some files in the program directory so that the upgrade process recognizes it as compatible. However, some documents will be missing, so if you are a perfectionist, you would want to find a full installer for Stata 18 later (which can be grabbed from <http://public.econ.duke.edu/stata/>, FYI).

## Reverse engineering

The tool I'm using is [Binary Ninja](https://binary.ninja/). I'm surprised they didn't strip symbols from `libstata-mp.dylib`. This does not appear in the Windows version, nor the GUI and CLI executables on macOS, so I guess that they simply do not know how to accomplish it safely on Mach-O dynamic libraries. Even without symbols, we can still easily coordinate code working with license keys, by searching for strings that go like "perpetual". The only reference to the string is a function named `_getlicstr`, which I think is short for "get license string", in which the buffer of the serial number is printed. Then I looked for references to the buffer, and found that both the write and check of the serial number happen in a function named `_sitechk`. Seems like a good place to start.

`_sitechk` first read file `stata.lic` in the installation directory, and split its content by "!" into 6 parts: serial number, "code", "authorization", user name, user organization, and a checksum. The checksum is only for validating the integrity of the `lic` file itself, in case anyone wants to edit this plain text file so that the user and organization can be changed. The only part that matters is the first 3 parts.

### Decoding

Then, the "code" and "authorization" are passed to `_ldecode`, in which the following procedure happens:

1. "L"s in the "code" are replaced with "l"s, and the space is removed. Then the string is concatenated with the "authorization" string.
2. Remember that our "code" and "authorization" consist of alphabets, digits and "$"? Now, the string is evaluated as a 37-based number, 0-1 is represented by "0-9", 10-35 are represented by "A-Z" or "a-z", and 36 is represented by "$" (fun fact, the ASCII code for "$" is 36).
3. Then these digits are somehow "convoluted": From left to right, each number is minus by the next number, and then it goes from right to left. Remember that we are 37-based, so the values should be filled in the range of 0-36. If the result is negative, add 37 to it.
4. Split the result of "convolution" into 2 parts, with 3 digits in the latter part. The latter part is a checksum. The first digit of the checksum is the sum of all digits in the former part, the second digit is the sum of digits on odd indexes. and the third digit for even indexes. This is calculated 37-based too.

`_ldecode` is highly SIMD optimized even on ARM, so it is hard to read. I had to learn some NEON to understand it.

### Interpreting

If the checksum doesn't go wrong, the former part will be a "decoded" string, which consists of 7 or 8 parts, depending on whether it is for MP edition or not, separated with "$". It should look like this:

```
9963000047$180$24$5$9999$a$$8
```

The meaning of each part is:

0. Serial number, which should be the same as the one in `stata.lic`.
1. Maximum Stata version that the license can be used on, something like "170" or "180". It is compared as a number, so you can go "999" if you want.
2. Should be "24".
3. Indicating if the license is for IC/BE edition. "2" for IC or BE, "5" for any other edition, including SE and MP.
4. User count. "Unlimited" is represented by "9999".
5. License type. Including network, student lab or compute server
6. Expiration date in the format of "MMDDYYYY", or empty for perpetual licenses. Additionally, years after 2050 are marked as invalid. I wonder if they have millennium bugs in old versions.
7. (Only for MP edition) The number of cores utilized. If it is empty, it won't come with its own "$", so the parsing will fail on MP editions (which actually does its job). This number is clamped to 64, then applied to `omp_set_num_threads`. And yes it just uses OpenMP for parallelism.

Additionally, some serial numbers are hard-coded to be invalid:

- 10699393
- 18461036
- 66610699393
- 501609213901
- 501709301094
- 401506209499
- 401609212764
- 301709301764

The are still uninvestigated code paths that might check the serial number itself, but seems like they are only reachable when a variable indicating debug mode is set, which can be ignored.

## Online updates

Now we know how to make our own "code" and "authorization", and we can happily perform offline updates since we can swap serial numbers at any time. What about online updates? If we use serial numbers from the Internet, we will get a "bad serial number" error. By using MitM package capture tools, we can inspect that during the update process, a request was sent to `https://www.stata.com/updates1801/up.cgi?s=xxxx&v=1800&r=1`, where the `xxxx` is our serial number, to check if our license is valid for updates. However, this API works in a way you might not expect: it works as a blacklist! Both legit and non-existent serial numbers will get an empty body response, while invalid serial numbers will get a response with an error in the body. So, we can just randomly generate a serial number, and check if it is valid by sending a request to this API. If it is valid, we can use it for online updates. If you are using network tools that support request rewrite like Surge, we can even write a rule for it to intercept with an empty body response.

![Surge rewrite rule](/img/stata-surge.png)

The rest of the update process doesn't even check the serial number, so we can call it a day. Below is a video as a proof of concept.

:bilibili{bvid="BV1GC4y1i7zi" width="960px" aspect-ratio="16/9"}

<!-- ## Easter egg

If you are in a hurry...

:stata-keygen -->
