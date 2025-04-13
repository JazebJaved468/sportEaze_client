# Dockerfile

FROM openjdk:11

# Install required dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    zip \
    nodejs \
    npm \
    wget \
    build-essential \
    python3 \
    openjdk-11-jdk \
    && rm -rf /var/lib/apt/lists/*

# Install Android SDK
ENV ANDROID_SDK_ROOT /opt/android-sdk
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools
WORKDIR $ANDROID_SDK_ROOT/cmdline-tools

RUN wget https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -O tools.zip \
    && unzip tools.zip -d latest \
    && rm tools.zip

ENV PATH $PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator

# Accept licenses and install build tools
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

# Set up working directory
WORKDIR /app

# Install Node packages separately to cache
COPY package.json yarn.lock ./
RUN npm install -g yarn && yarn install

# Copy the rest of the project
COPY . .

# Make gradlew executable
RUN chmod +x android/gradlew

# Build release APK
CMD ["./android/gradlew", "assembleRelease"]
