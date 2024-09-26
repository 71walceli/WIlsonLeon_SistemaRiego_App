FROM ubuntu:22.04


RUN dpkg --add-architecture 'i386'
# This prevets shell from askinf for region. timezone, or anything asked interactivaly by `apt`
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y --no-install-recommends wget unzip openjdk-21-jdk && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV ANDROID_HOME /App/android
WORKDIR ${ANDROID_HOME}/cmdline-tools/latest
RUN wget -O commandlinetools-linux-11076708_latest.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip?hl=es-419
RUN unzip commandlinetools-linux-11076708_latest.zip cmdline-tools/*
RUN mv cmdline-tools/* .
RUN rm commandlinetools-linux-11076708_latest.zip
RUN chmod +x ./bin/*
ENV PATH ${ANDROID_HOME}/cmdline-tools/latest/bin:${PATH}

RUN mkdir -p ${ANDROID_HOME} 

RUN yes | sdkmanager --licenses
RUN yes | sdkmanager --install platform-tools
ENV PATH ${ANDROID_HOME}/platform-tools:${PATH}}

RUN apt-get update && apt-get install --no-install-recommends curl gpg -y; \
  mkdir -p /etc/apt/keyrings && \
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
    | tee /etc/apt/sources.list.d/nodesource.list && \
  apt-get update && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*;
  
RUN npm install -g yarn
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*;

# Added non-root user
ARG UID=1000
ARG GID=1000
ARG USER=AndroidStudio
RUN groupadd -g ${GID} ${USER}
RUN useradd ${USER} -u ${UID} -g ${GID} -m -s /bin/bash
RUN chown -R ${UID}:${GID} /home/${USER}

# Add it to sudo and privileges
RUN echo "${USER}:${USER}" | chpasswd
# Make sudo passwordless
RUN mkdir -p /etc/sudoers.d
RUN echo "${USER} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/90-${USER}
RUN usermod -aG sudo ${USER}
RUN usermod -aG plugdev ${USER}

WORKDIR /Project
RUN chown -R ${UID}:${GID} ${ANDROID_HOME}
USER ${USER}
#RUN yes | sdkmanager --licenses
RUN yes | sdkmanager --install "ndk;24.0.8215888"
RUN yes | sdkmanager --install "ndk;26.1.10909125"


