## Stash App
A multiuser authenticated system for cataloging and categorizing makeup items and their uses.

## Motivation
Lauren is a hobbyist who buys every red lipstick on impulse... not realizing she has backups for her backups in herotext makeup kit at home.

Leah is professional on-site with a client who wants to recreate a stunning
look from six months ago, but ...what was the shade she used in the socket that made everything pop?

They both need StashApp to catalog their collections and looks for easy
on-the-go access.
 
## Tech/framework used
Ex. -

<b>Back-End</b>
- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/)

<b>Front-End Built with</b>
- [React](https://reactjs.org)
- [Redux](https://reduxjs.org)


Check out the frontend code [on Github](https://github.com/katharinemc/stashApp_FrontEnd)

## Features
- Server-side validation ensures identical duplicate products cannot be added.
- Users can view and search other user's content.
- Attempting to delete a product used in a look triggers a warning message. If user chooses to delete, the product will be removed from any Looks in which it is included.

## Code Example

Uses 3 models for User, Product, and Looks.  There are 3 corresponding routers plus an auth.js router for authentication using passport and JSON webtokens.  Most endpoints are protected, except the GET endpoints for products and looks to enable unauthenticated users to view content.

```
stashAppServer/
  README.md
  node_modules/
  db/
    seed/
  models/
    look.js
    product.js
    user.js
  passport/
  public/
  routes/
    auth.js
    looks.js
    products.js
    public.js
    users.js
  utils/
    seed.js
  server.js    
```