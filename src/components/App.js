import React, { useEffect, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import api from "../utils/Api";
import AddPlacePopup from "./AddPlacePopup";

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api
      .getUserInfo()
      .then((profileInfo) => setCurrentUser(profileInfo))
      .catch((err) => console.log(err));

    api
      .getInitialCards()
      .then((data) => {
        setCards(
          data.map((card) => ({
            _id: card._id,
            name: card.name,
            link: card.link,
            likes: card.likes,
            owner: card.owner,
          }))
        );
      })
      .catch((err) => console.log(err));
  }, []);

  function closeAllPopup() {
    setEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    api
      .addLike(card._id, !isLiked)
      .then((newCard) =>
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item))
        )
      )
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() =>
        setCards((state) => state.filter((item) => item._id !== card._id))
      )
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(newInfo) {
    setIsLoading(true);
    api
      .setInfo(newInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopup();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true);
    api
      .setAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopup();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopup();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />

        <Main
          onEditAvatar={setEditAvatarPopupOpen}
          onEditProfile={setIsEditProfilePopupOpen}
          onAddPlace={setIsAddPlacePopupOpen}
          onCardClick={setSelectedCard}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          cards={cards}
        />

        <Footer />

        <ImagePopup card={selectedCard} onClose={closeAllPopup} />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopup}
          onUpdateUser={handleUpdateUser}
          onLoading={isLoading}
        />

        <PopupWithForm name="consent" title="Вы уверены?" buttonText="Да" />

        <EditAvatarPopup
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopup}
          onLoading={isLoading}
        />

        <AddPlacePopup
          onAddPlace={handleAddPlaceSubmit}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopup}
          onLoading={isLoading}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
