# Use the official Arch Linux base image
FROM archlinux:base

# Update the system and install essential development tools
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm base-devel git vim curl wget bash openssh && \
    pacman -Scc --noconfirm

# Set up a user for the IDE (to avoid running as root)
RUN useradd -m -s /bin/bash nimbususer && \
    echo "nimbususer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/nimbususer

# Switch to the nimbususer
USER nimbususer
WORKDIR /home/nimbususer

# Set the default shell prompt
ENV PS1="user@nimbispad++:~ "

# Command to keep the container running
CMD ["/bin/bash"]
