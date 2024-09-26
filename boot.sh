
yes | sdkmanager --licenses

if [ ! -d node_modules ]
then
    yarn install
fi

export EXPO_TOKEN=${EXPO_TOKEN}
export API_BASE_URL=${API_BASE_URL}
yarn start & sleep 1
server_pid=$!
wait $server_pid
