echo Please add a commit message
read message


git add .
git commit -a -m $message
git push
