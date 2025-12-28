set -e

npm run build

cd dist

git init
git add -A
git commit -m 'New Deploy'
git push -f https://github.com/JoaoCorreia00/LusoTourism.git first:gh-pages

cd -