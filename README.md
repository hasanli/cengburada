# Cengburada

## Register/Login

- Registers are limited to users only which can be accessed from top right of the screen, new admins can only be registered by being added by an existing admin.

- Logins are also located to the right of the navbar.

Example user login {user: emine, pass: user}
Example admin login: {user:testadmin, pass:admin}

## Techstack

### I tried to go wiith the simplest and easiest option to keep things to a minimum, therefore:

- Next.js: From a previous project, most widely used I think. Couldn't think of another option.
- React: Again, used in a project before, component structure helps a lot.
- Bootstrap: I couldn't set up tailwind, therefore I went with my next minimal and fast option.
- MongoDB/ Mongoose: as required in the given assignment, very flexible usage.

## User Guide

- Users can rate and review items, which then can be previewed in the profile and the item description. They can be edited just by rating and reviewing again.

- Non-Users can only preview the listed items and tehy cannot post reviews or ratings.

- Admins have access to the admin panel where they can add/remove/edit items and add/remove users with both user and admin privileges. They also have access to userlist and itemlist, their avg ratings and so on.

## Notes

- I used dynamic schemas in my db, used 2 collections (could be a single one but does not make sense) to take advantage of the NoSQL based MongoDB

## Vercel

- Vercel deployment URL: https://cengburada.vercel.app/