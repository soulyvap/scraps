# Scraps - where neighbors share

Scraps is a React Native app meant to connect neighbours that want to share their food that would otherwise go to waste. Scraps encourages people to share their leftovers, spotty bananas or food they wouldn't be able to finish before a weekend trip.

The purpose of this app is to limit food waste, provide a platform to connect neighbours and perhaps even save money and time.

You can watch our short ad video [here](https://youtu.be/0MC6VphN8bM). We also provide a feature run-through video in the **Video** section of this document.

## Main features

 - After registering their address on Scraps, the user is able to view post within 500 meter radius ensuring the "neighbour" aspect of the app.
 - Users are able to post detailed posts listing their food items. They can include allergens, assign tags, category and provide latest pick up date and suitable time slots for pick up. 
 - Users can book the food items, arrange pick ups, cancel, delete or mark listings as picked up.
 - Chat feature allows users to get to know their neighbours, talk about food, clarify pick up circumstances, ask for recipes, etc.
 - Users can review other users.
 - Food listings can be filtered by tag, category or both.
 - Users can update their account, including profile picture, bio, email, username, full name and password.

## Backend implementation

We used a simple media sharing backend that was provided. Therefore, implementation of some features wasn't as straighforward. Here we will provide a few explanations of how we used the existing backend to implement our features.

![User Creation](https://users.metropolia.fi/~gintares/Scraps/User%20creation.png)

![Chat](https://users.metropolia.fi/~gintares/Scraps/Chat.png)

![Review Users](https://users.metropolia.fi/~gintares/Scraps/Reviews.png)

![Post](https://users.metropolia.fi/~gintares/Scraps/Post.png)


## Changes after feedback

Some bigger issues during testing session were caused by testers reusing their old accounts that do not work on our application. However, some feedback mentioned included good suggestions and we implemented the following changes:

 - Detailed post page had too much text --> tags removed.
 - Tags and allergens are too similar/overlap --> made them different.
 - Input font size in post creation too small --> made font size larger.
 - Product card could be larger --> slightly enlarged the product card.
 - Make a possibility to view password --> added "eye icon" to reveal password if needed.

During the testing session, some iOS users have pointed out two main issues:
- Date and time picker in post creation didn't work therefore they were not able to create a post.
- Issues with keyboard avoiding view and not being able to click off the keyboard to hide it.
We were not able to fix iOS issues as non of our team members have immediate access to an iOS device that would allow us to test it.

## Video
The app and all the features can be seen in our app run-through [video](https://youtu.be/Yq6ett-ydms).

## Developers
- [Gintare Saali](https://github.com/gintaresaali)
- [Sirja Kosonen](https://github.com/sirjak)
- [Soulyvanh Phetsarath](https://github.com/soulyvap)
