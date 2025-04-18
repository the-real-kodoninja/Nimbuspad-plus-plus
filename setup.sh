#!/bin/bash
# nimbuspad-plus-plus/setup.sh

echo "Installing Vim and dependencies..."
sudo apt update
sudo apt install -y vim curl

echo "Installing vim-plug..."
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

echo "Cleaning up old plugins..."
rm -rf ~/.vim/plugged

echo "Installing plugins..."
vim -u src/vimrc +PlugInstall +qall

echo "Setup complete! Run 'npm start' to launch Nimbuspad++."
