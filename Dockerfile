FROM rust:bullseye

COPY . ./prop-pool

WORKDIR /prop-pool

# Update and install dependencies
RUN apt-get update && \
    apt-get install -y pkg-config libudev-dev libssl-dev git libclang-dev clang && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Clone and install surfpool from source
RUN git clone https://github.com/txtx/surfpool.git ./surfpool && \
    cargo install --path ./surfpool/crates/cli --locked --force

# Expose common Solana ports
EXPOSE 8899 8900 8080

# Set the command to run surfpool
CMD ["surfpool", "--rpc-url", ${MAINNET_RPC_URL}]