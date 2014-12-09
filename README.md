# Xmr - [ig-zam-r]
noun, informal

1.  a NodeJS based web application to help you study without overwhelming feelings.

# Things to know before installation
This project is under development. I have written this to help myself study for my university exams at Lund's Institute of Technology, Sweden. All exam problem and answer images that can be found in this git repository are copyrighted to Lund University and will be removed from this repo. Everyone will have to extract problem images individually from their own PDF resources. You can use `http://github.com/Zolomon/Exameer-PDF-editor` to do this. 

There is a `db.js` file which can generate a the database from the problem sets. 

The problem sets should be put in `./public/images/courses/<course code>/<exam date>/{exams,solutions}/<index>.png`. There has to be an image in the `exams` folder, but not necessarily one in the `solutions` directory (if both exists, they MUST have the same index number to be paired correctly).

# How to install
`NodeJS` and `npm` are necessary 

```bash
git clone git@github.com:Zolomon/xmr.git
cd xmr
rm -rf data/data.db
nodejs db.js
npm install
```

# How to run
```bash
grunt --force
```

# How to add a new course
```bash
cd <path to xmr repository>/
mkdir -p public/images/courses/<course code>/exams
mkdir -p public/images/courses/<course code>/solutions

# For each exam in a course, do:
mkdir -p public/images/courses/<course code>/exams/<exam date in YYMMDD>
mkdir -p public/images/courses/<course code>/solutions/<exam date in YYMMDD>

# Now, place .png files that represent questions every folder in public/images/courses/<course code>/{exams,solutions}/<exam date in YYMMDD>.
# Use https://github.com/zolomon/exameer-pdf-editor to create .png files, or GIMP.

# Run db.js and add the new course.
db.js -d <course code>
```

Now visit `localhost:3000/` and you should be able to browse the currently available exams used for testing. 

# License
Copyright (C) 2014 Bengt Ericsson, pending license changes.
