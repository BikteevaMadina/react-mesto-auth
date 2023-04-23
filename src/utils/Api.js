class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResult(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getInitialCards() {
    // получение карточек методом GET
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => this._checkResult(res));
  }

  addNewCard(data) {
    // добавление карточки методом POST
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then((res) => this._checkResult(res));
  }

  deleteCard(cardId) {
    // удаление карточки
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._checkResult(res));
  }

  addLike(cardId, isLiked) {
    // поставить и удалить лайк
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: `${isLiked ? "PUT" : "DELETE"}`,
      headers: this._headers,
    }).then((res) => this._checkResult(res));
  }

  getUserInfo() {
    // получение информации пользователя
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => this._checkResult(res));
  }

  setInfo(forms) {
    // изменение информации пользователя
    return fetch(`${this._baseUrl}/users/me`, {
      // методом PATCH
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(forms),
    }).then((res) => this._checkResult(res));
  }

  setAvatar(data) {
    // изменение аватара пользователя
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      // методом PATCH
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => this._checkResult(res));
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-60",
  headers: {
    authorization: "99ec2b63-21d0-4a18-afc1-bc28f717f199",
    "Content-Type": "application/json",
  },
});

export default api;
