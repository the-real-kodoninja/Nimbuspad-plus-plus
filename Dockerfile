FROM archlinux:latest

# Install dependencies
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm vim git nodejs npm bash sudo

# Create nimbususer and set up repos directory
RUN useradd -m -s /bin/bash nimbususer && \
    mkdir -p /home/nimbususer/repos && \
    chown nimbususer:nimbususer /home/nimbususer/repos && \
    echo "nimbususer ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Set the PS1 prompt directly, ensuring it's applied for all shells
ENV PS1_DEFAULT='\u@\h:\w\$ '
RUN echo 'if [ -n "$PS1" ]; then export PS1="$PS1"; else export PS1="$PS1_DEFAULT"; fi' >> /etc/profile && \
    echo 'if [ -n "$PS1" ]; then export PS1="$PS1"; else export PS1="$PS1_DEFAULT"; fi' >> /home/nimbususer/.bashrc && \
    echo 'if [ -n "$PS1" ]; then export PS1="$PS1"; else export PS1="$PS1_DEFAULT"; fi' >> /home/nimbususer/.bash_profile && \
    chown nimbususer:nimbususer /home/nimbususer/.bashrc /home/nimbususer/.bash_profile

USER nimbususer
WORKDIR /home/nimbususer
