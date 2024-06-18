{ pkgs, ... }: {
  channel = "stable-23.11";

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.oha
  ];

  env = {};
}
