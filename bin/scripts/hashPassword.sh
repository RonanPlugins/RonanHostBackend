#!/bin/bash

password=$1
hashedPassword=$(node -e "const bcrypt = require('bcrypt'); bcrypt.hash('$password', 10).then(hash => console.log(hash))")
echo $hashedPassword
