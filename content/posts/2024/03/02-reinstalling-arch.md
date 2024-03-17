---
date: 2024-03-02
---

# Reinstalling Arch Linux

I have been using Arch Linux on my "mobile workstation" (that is, the ASUS
Zephyrus M16 2021 mentioned on my GitHub readme page) for a while, and switched
to Ubuntu in order to work on ROS2 projects half a year ago. However, I still
miss the ease of SOTA configuration back in Arch. Some days ago, I tried to boot
into my old Arch installation but found the GPG keyring had expired during the
gap. Although this can be fixed by some manual operations, I eventually decided
to reinstall the system. This will also give me a chance to try out some new
ideas on the system.

![niri screenshot](/img/niri-screenshot.png)

## Installation

I basically just followed the steps on
[nakanomikuorg/arch-guide](https://arch.icekylin.online/guide/rookie/basic-install.html).
This guide is in Chinese and not very diverged from
[the official installation guide](https://wiki.archlinux.org/title/Installation_guide).

### Partitioning

The guide suggests using Btrfs subvolumes to separate `/` and `/home`, which is
a good idea. Although I don't do snapshots and rollbacks as the guide does, the
advantage of making subvolumes is at least obvious in this reinstallation. The
old `/` subvolume, named `/@`, can be simply `mv`-ed to a new name (actually it
can be left as is, but I want to make it clear that it's the old one), and so
the old `/home` subvolume. In addition to these two, I also created subvolumes
for `/var` and `/var/cache`, for easier management of package cache and logs. If
Nix is to be installed in the future, I will also create a subvolume for `/nix`.

One thing I think the guide is wrong with is mounting the ESP to `/boot`. Arch
Linux stores all kernel images and initramfs in `/boot`. If one has multiple
distributions installed, they will definitely conflict with each other. I
mounted the ESP to `/efi` instead. And frankly speaking, with rEFInd
pre-installed, the ESP is not even necessary to be mounted, but I did it for
using Unified Kernel Images (UKI).

I also omitted the swap partition. I have 40GB (8GB soldered, 32GB SODIMM) of
RAM, and I don't think I will ever use a swap. If I do, I will use a swap file
instead.

```sh
mount -o subvol=/@,compress=zstd /dev/nvmexn1pn /mnt
mount -o subvol=/@home,compress=zstd --mkdir /dev/nvmexn1pn /mnt/home
mount --mkdir /dev/nvmexn1pn /mnt/efi
```

### Bootloader

As mentioned above, I use rEFInd as my bootloader. I can just copy my old
`/boot/refind_linux.conf` to the new installation, and it will work. But I
wanted to try out the UKI, so I followed the instructions on
[the ArchWiki page](https://wiki.archlinux.org/title/Unified_kernel_image).

The UKI is a kernel image that also is an EFI executable. It packs the kernel
image and kernel modules into a single file, and can be booted directly by the
UEFI firmware. As a result, things like secure boot and TPM-based integrity
verification can be easily implemented.

In the case that suitable kernel parameters are presenting, switching to UKI is
as simple as removing some `#` in `/etc/mkinitcpio.d/linux.preset`, since
mkinitcpio will pick up the parameters from the current boot if
`/etc/kernel/cmdline` is not present. For long-term use, creating
`/etc/kernel/cmdline` is still necessary. After UKI is generated, either by
`mkinitcpio -p linux` or by reinstalling some packages like `linux`, new options
will be added to rEFInd's boot menu, and one can even set the default boot
option in BIOS to be the UKI.

### Post-installation

I use `paru` as my AUR helper, but it is not in the official repository. I added
the `archlinuxcn` repository to the pacman configuration, but the official CN
wiki page did not mention (it is in the news feed, though) a recent change in
the GPG trust chain that makes the `archlinuxcn-keyring` package not
installable. A workaround is to manually trust the key by executing
`sudo pacman-key --lsign-key "farseerfc@archlinux.org"`.

## Configuration

I have been using Home Manager (a Nix project) to manage my dotfiles, but I'm
not very satisfied with it. I hated that I needed to wait for a minute for my
configuration to land on the ground, while the program I configuring actually
supported hot reloading. I'm looking for a new solution.

### Shell

I ended up installing `fish` as my shell. The concept of `fish` is to encourage
users to write functions. That's why they have a dedicated `funced` command to
edit functions.

### Window Manager

I tried out the new `niri` window manager. It's a tiling window manager written
in Rust. Its concept is very unique: workspaces are infinite on the horizontal
axis, and windows are arranged in columns. It is still in its early stages, but
I think it's fun to play with.

`xkbcli interactive-wayland` can be used to find out the keycodes of the keys on
the keyboard. I used it to find out the keycodes of the ROG keys on my laptop
and configured them to launch the `rog-command-center` provided by
[asus-linux.org](https://asus-linux.org).

### Keyboard Remapping

I used Karabiner Elements to remap the `Caps Lock` key to `Escape` and `Ctrl`
when pressed alone and held, respectively. Turns out that
[wez/evremap](https://github.com/wez/evremap) (notice that this is the "Wez" in
"WezTerm") is one of the best choices for this task on Linux. It's a daemon that
listens to the `/dev/input/event*` and pops out a virtual device. In contrast to
`XF86AudioMute` used in the last section, here we need to find out key codes
under the libinput format, which can be done by `libinput debug-events`.

### Status Bar

Since there are no preconfigured bars with integration with `niri` yet, I went
for `eww`, which I haven't had a chance to try out. It is themed with Sass,
which Catppuccin happens to
[have support for](https://github.com/catppuccin/palette/blob/main/docs/sass.md),
so I just grab the palette from there.

### Handy Web Apps

The Telegram desktop client is a heavy Qt application, I don't want to install
it for now. IME support on `niri` is not clear yet.
[Telegram Web](https://web.telegram.org/) is the web version of Telegram.
[My RIME](https://my-rime.vercel.app/) is a web app that works as a RIME input
method. I simply pinned them to the Firefox tab bar, along with the `daed`,
which will be introduced in the next section.

### System-wide Proxy

As long as I'm living in Mainland China, the importance of a system-wide proxy
is not to be mentioned. To take a bite of the goose, I went for `dae`, which is
a proxy tool that filters traffic using eBPF. When the policy is set to
`direct`, `dae` will create an asymmetric NAT, that bypasses the proxy stack,
making it faster than any other solutions using redirection or TUN. What's more,
`dae` can handle proxy subscriptions too (only `v2ray` format is supported at
the moment).

Just like `clash`, `dae` itself is a lightweight daemon that does not provide a
GUI. Luckily the project officially provides an integration solution called
`daed`. It's a unified daemon that also serves a web API and GUI. One doesn't
need to install `dae` separately, as it's already included in `daed`, and both
are provided in `archlinuxcn` repository.

Since `dae` only supports `v2ray` subscriptions, a converter is often needed.
[Sub-Store](https://github.com/sub-store-org/Sub-Store) has supported hosted
deployments (in contrast to parasitizing in scripting support of some MitM proxy
tools). One can deploy their own with the following `compose.yml`:

```yml
version: "3.8"
services:
  sub-store:
    image: xream/sub-store:latest # This is the official image
    container_name: sub-store
    restart: always
    volumes:
      - data:/opt/app/data
    environment:
      - SUB_STORE_FRONTEND_BACKEND_PATH=/2cXaAxRGfddmGz2yx1wA # Change this

      # If you want to update the subscription regularly
      # - "SUB_STORE_CRON=55 23 * * *" # using crond
      # - "SUB_STORE_BACKEND_CRON=55 23 * * *" # using node-cron

      # If you have notification webhooks, like Bark
      # - "SUB_STORE_PUSH_SERVICE=https://api.day.app/XXXXXXXXXXXX/[推送标题]/[推送内容]?group=SubStore&autoCopy=1&isArchive=1&sound=shake&level=timeSensitive&icon=https%3A%2F%2Fraw.githubusercontent.com%2F58xinian%2Ficon%2Fmaster%2FSub-Store1.png"
    ports:
      - 127.0.0.1:3001:3001 # Only expose to localhost
    stdin_open: true
    tty: true
volumes:
  data:
```

Then you can open
`http://127.0.0.1:3001?api=http://127.0.0.1:3001/2cXaAxRGfddmGz2yx1wA` in your
browser to manage your subscriptions. However, I found that the container will
cause the powering off procedure to stall for a while, so I would like to host
it elsewhere.
