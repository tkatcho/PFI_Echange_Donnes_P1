////////////////////////////////////////////// API photos_APIs call ///////////////////////////////////////////////////////

const serverHost = "http://localhost:5000";
const photos_API = "/api/photos";

class API {
<<<<<<< HEAD
    static initHttpState() {
        this.currentHttpError = "";
        this.currentStatus = 0;
        this.error = false;
    }
    static setHttpErrorState(xhr) {
        if (xhr.responseJSON)
            this.currentHttpError = xhr.responseJSON.error_description;
        else
            this.currentHttpError = xhr.statusText;
        this.currentStatus = xhr.status;
        this.error = true;
    }
    static storeAccessToken(token) {
        sessionStorage.setItem('access_Token', token);
    }
    static eraseAccessToken() {
        sessionStorage.removeItem('access_Token');
    }
    static retrieveAccessToken() {
        return sessionStorage.getItem('access_Token');
    }
    static storeLoggedUser(user) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }
    static retrieveLoggedUser() {
        let user = JSON.parse(sessionStorage.getItem('user'));
        return user;
    }
    static eraseLoggedUser() {
        sessionStorage.removeItem('user');
    }
    static registerRequestURL() {
        return serverHost + '/Accounts/register';
    }
    static tokenRequestURL() {
        return serverHost + '/token';
    }
    static getBearerAuthorizationToken() {
        return { 'Authorization': 'Bearer ' + API.retrieveAccessToken() };
    }
    static checkConflictURL() {
        return serverHost + "/accounts/conflict";
    }
    static logout() {
        API.initHttpState();
        return new Promise(resolve => {
            let loggedUser = API.retrieveLoggedUser();
            $.ajax({
                url: serverHost + "/accounts/logout?userId=" + loggedUser.Id,
                contentType: 'text/plain',
                type: 'GET',
                data: {},
                success: async () => {
                    API.eraseLoggedUser();
                    API.eraseAccessToken();
                    resolve(true);
                },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static register(profil) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + "/accounts/register",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(profil),
                success: profil => { resolve(profil); },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static login(Email, Password) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: API.tokenRequestURL(),
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify({ Email, Password }),
                success: async token => {
                    API.storeAccessToken(token.Access_token);
                    API.storeLoggedUser(token.User);
                    resolve(token.User);
                },
                
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static verifyEmail(userId, verifyCode) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + `/Accounts/verify?id=${userId}&code=${verifyCode}`,
                type: 'GET',
                contentType: 'text/plain',
                data: {},
                success: (profil) => {
                    API.storeLoggedUser(profil);
                    resolve(true);
                },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static modifyUserProfil(profil) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + "/Accounts/modify/" + profil.Id,
                type: 'PUT',
                contentType: 'application/json',
                headers: API.getBearerAuthorizationToken(),
                data: JSON.stringify(profil),
                success: (profil) => {
                    API.storeLoggedUser(profil);
                    resolve(profil);
                },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static unsubscribeAccount(userId) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + "/accounts/remove/" + userId,
                contentType: 'application/json',
                type: 'GET',
                data: {},
                headers: API.getBearerAuthorizationToken(),
                success: () => {
                    //API.deConnect();
                    //delete photo
                    resolve(true);
                },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
     static GetAccounts() {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + "/accounts",
                contentType: 'application/json',
                type: 'GET',
                headers: API.getBearerAuthorizationToken(),
                success: (data, status, xhr) => {
                    let ETag = xhr.getResponseHeader("ETag");
                    resolve({ data, ETag });
                },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static GetPhotosETag() {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + photos_API,
                type: 'HEAD',
                headers: API.getBearerAuthorizationToken(),
                complete: (request) => { resolve(request.getResponseHeader('ETag')) },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static GetPhotosById(id) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + photos_API + "/" + id,
                type: 'GET',
                headers: API.getBearerAuthorizationToken(),
                success: data => { resolve(data); },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static GetPhotos(queryString = null) {
        let url = serverHost + photos_API + (queryString ? queryString : "");
        return new Promise(resolve => {
            $.ajax({
                url: url,
                headers: API.getBearerAuthorizationToken(),
                type: 'GET',
                success: (data, status, xhr) => {
                    let ETag = xhr.getResponseHeader("ETag");
                    resolve({ data, ETag });
                },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static CreatePhoto(data) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + photos_API,
                type: 'POST',
                headers: API.getBearerAuthorizationToken(),
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: data => { resolve(data) },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static UpdatePhoto(data) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + photos_API + "/" + data.Id,
                type: 'PUT',
                headers: API.getBearerAuthorizationToken(),
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: () => { resolve(true) },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
    static DeletePhoto(id) {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: serverHost + photos_API + "/" + id,
                type: 'DELETE',
                headers: API.getBearerAuthorizationToken(),
                success: () => { resolve(true) },
                error: xhr => { API.setHttpErrorState(xhr); resolve(false); }
            });
        });
    }
}
=======
  static initHttpState() {
    this.currentHttpError = "";
    this.currentStatus = 0;
    this.error = false;
  }
  static setHttpErrorState(xhr) {
    if (xhr.responseJSON)
      this.currentHttpError = xhr.responseJSON.error_description;
    else this.currentHttpError = xhr.statusText;
    this.currentStatus = xhr.status;
    this.error = true;
  }
  static storeAccessToken(token) {
    sessionStorage.setItem("access_Token", token);
  }
  static eraseAccessToken() {
    sessionStorage.removeItem("access_Token");
  }
  static retrieveAccessToken() {
    return sessionStorage.getItem("access_Token");
  }
  static storeLoggedUser(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }
  static retrieveLoggedUser() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    return user;
  }
  static eraseLoggedUser() {
    sessionStorage.removeItem("user");
  }
  static registerRequestURL() {
    return serverHost + "/Accounts/register";
  }
  static tokenRequestURL() {
    return serverHost + "/token";
  }
  static getBearerAuthorizationToken() {
    return { Authorization: "Bearer " + API.retrieveAccessToken() };
  }
  static checkConflictURL() {
    return serverHost + "/accounts/conflict";
  }
  static logout() {
    API.initHttpState();
    return new Promise((resolve) => {
      let loggedUser = API.retrieveLoggedUser();
      $.ajax({
        url: serverHost + "/accounts/logout?userId=" + loggedUser.Id,
        contentType: "text/plain",
        type: "GET",
        data: {},
        success: async () => {
          API.eraseLoggedUser();
          API.eraseAccessToken();
          resolve(true);
        },
        error: (xhr) => {
          loginMessage = "server error";
          logout();
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static register(profil) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + "/accounts/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(profil),
        success: (profil) => {
          resolve(profil);
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static login(Email, Password) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: API.tokenRequestURL(),
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({ Email, Password }),
        success: async (token) => {
          API.storeAccessToken(token.Access_token);
          API.storeLoggedUser(token.User);
          resolve(token.User);
        },
        error: (xhr) => {
          loginMessage = "server error";
          logout();
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static verifyEmail(userId, verifyCode) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + `/Accounts/verify?id=${userId}&code=${verifyCode}`,
        type: "GET",
        contentType: "text/plain",
        data: {},
        success: (profil) => {
          API.storeLoggedUser(profil);
          resolve(true);
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static admin(id) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + `/accounts/admin/` + id,
        type: "PUT",
        contentType: "application/json",
        headers: API.getBearerAuthorizationToken(),
        data: JSON.stringify(id),
        success: () => {
          resolve(true);
        },
        error: (xhr) => {
          loginMessage = "server error";
          logout();
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static unadmin(id) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + `/accounts/unadmin/` + id,
        type: "PUT",
        contentType: "application/json",
        headers: API.getBearerAuthorizationToken(),
        data: JSON.stringify(id),
        success: () => {
          resolve(true);
        },
        error: (xhr) => {
          loginMessage = "server error";
          logout();
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static block(id) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + `/accounts/block/` + id,
        type: "PUT",
        contentType: "application/json",
        headers: API.getBearerAuthorizationToken(),
        data: JSON.stringify(id),
        success: () => {
          resolve(true);
        },
        error: (xhr) => {
          loginMessage = "server error";
          logout();
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static unblock(id) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + `/accounts/unblock/` + id,
        type: "PUT",
        contentType: "application/json",
        headers: API.getBearerAuthorizationToken(),
        data: JSON.stringify(id),
        success: () => {
          resolve(true);
        },
        error: (xhr) => {
          loginMessage = "server error";
          logout();
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static modifyUserProfil(profil) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + "/Accounts/modify/" + profil.Id,
        type: "PUT",
        contentType: "application/json",
        headers: API.getBearerAuthorizationToken(),
        data: JSON.stringify(profil),
        success: (profil) => {
          API.storeLoggedUser(profil);
          resolve(profil);
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static unsubscribeAccount(userId) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + "/accounts/remove/" + userId,
        contentType: "application/json",
        type: "GET",
        data: {},
        headers: API.getBearerAuthorizationToken(),
        success: () => {
          //API.deConnect();
          //delete photo
          resolve(true);
        },
        error: (xhr) => {
          loginMessage = "server error";
          logout();
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static GetAccounts() {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + "/accounts",
        contentType: "application/json",
        type: "GET",
        headers: API.getBearerAuthorizationToken(),
        success: (data, status, xhr) => {
          let ETag = xhr.getResponseHeader("ETag");
          resolve({ data, ETag });
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          loginMessage = "server error";
          logout();

          resolve(false);
        },
      });
    });
  }
  static GetPhotosETag() {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + photos_API,
        type: "HEAD",
        headers: API.getBearerAuthorizationToken(),
        complete: (request) => {
          resolve(request.getResponseHeader("ETag"));
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static GetPhotosById(id) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + photos_API + "/" + id,
        type: "GET",
        headers: API.getBearerAuthorizationToken(),
        success: (data) => {
          resolve(data);
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static GetPhotos(queryString = null) {
    let url = serverHost + photos_API + (queryString ? queryString : "");
    return new Promise((resolve) => {
      $.ajax({
        url: url,
        headers: API.getBearerAuthorizationToken(),
        type: "GET",
        success: (data, status, xhr) => {
          let ETag = xhr.getResponseHeader("ETag");
          resolve({ data, ETag });
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static CreatePhoto(data) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + photos_API,
        type: "POST",
        headers: API.getBearerAuthorizationToken(),
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (data) => {
          resolve(data);
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static UpdatePhoto(data) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + photos_API + "/" + data.Id,
        type: "PUT",
        headers: API.getBearerAuthorizationToken(),
        contentType: "application/json",
        data: JSON.stringify(data),
        success: () => {
          resolve(true);
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
  static DeletePhoto(id) {
    API.initHttpState();
    return new Promise((resolve) => {
      $.ajax({
        url: serverHost + photos_API + "/" + id,
        type: "DELETE",
        headers: API.getBearerAuthorizationToken(),
        success: () => {
          resolve(true);
        },
        error: (xhr) => {
          API.setHttpErrorState(xhr);
          resolve(false);
        },
      });
    });
  }
}
>>>>>>> d32d47004a019cc87968539359e6212f1247b190
