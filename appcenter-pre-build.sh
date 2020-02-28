echo "Installing git-crypt dependencies"
brew install openssl
brew install git-crypt

echo "Decoding git-crypt key"
echo $GIT_CRYPT_KEY | openssl base64 -d -A -out mittatb.key

echo "Unlocking repository sensitive files"
git-crypt unlock mittatb.key

cat <<EOT >> .env
BUGSNAG_API_KEY=$BUGSNAG_API_KEY
API_BASE_URL=$API_BASE_URL
APP_VERSION=1.0
APP_BUILD_NUMBER=$APPCENTER_BUILD_ID
EOT

if [ "$ENABLE_E2E" = true ]; then
    echo "Install E2E tools"
    brew tap wix/brew
    brew update
    brew install applesimutils

    echo "Install pods"
    cd ios; pod install; cd ..

    echo "Build detox E2E tests"
    npx detox build --configuration ios.sim.release

    echo "Run detox E2E tests"
    npx detox test --configuration ios.sim.release --cleanup
fi