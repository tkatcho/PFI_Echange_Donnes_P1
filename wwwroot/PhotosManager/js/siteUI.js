let contentScrollPosition = 0;
let isAdmin = false;
let isConnected = false;
let loggedUser;
let loginMessage = "";
let accountCreationSuccess = false;

//#region //////////////////////////////////Viewsrendering////////////////////////////////////////////////
function showWaitingGif() {
  eraseContent();
  $("#content").append(
    $(
      "<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"
    )
  );
}
function eraseContent() {
  $("#content").empty();
}
function saveContentScrollPosition() {
  contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
  $("#content")[0].scrollTop = contentScrollPosition;
}
function updateHeader(viewTitle) {
  let title = viewTitle;
  let headerContent;

  if (isConnected && title == "Liste de photos") {
    headerContent = `
    <span title="Liste des photos" id="listPhotosCmd">
  <img src="images/PhotoCloudLogo.png" class="appLogo">
</span>

<span class="viewTitle">${title}
  <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
</span>

<div class="headerMenusContainer">
  <span>&nbsp;</span>
  <i title="Modifier votre profil">
    <div class="UserAvatarSmall" userid="${loggedUser.Id}" id="editProfilCmd"
      style="background-image:url('${loggedUser.Avatar}')"
      title="Nicolas Chourot"></div>
  </i>

  <div class="dropdown ms-auto dropdownLayout">
    <!-- Your dropdown content goes here -->
  </div>
</div>
  `;
  } else if(isConnected && title == "Profil"){
    headerContent = `
    <span title="Profil" id="listPhotosCmd">
  <img src="images/PhotoCloudLogo.png" class="appLogo">
</span>

<span class="viewTitle">${title}
  <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
</span>

<div class="headerMenusContainer">
  <span>&nbsp;</span>
  <i title="Modifier votre profil">
    <div class="UserAvatarSmall" userid="${loggedUser.Id}" id="editProfilCmd"
      style="background-image:url('${loggedUser.Avatar}')"
      title="Nicolas Chourot"></div>
  </i>

  <div class="dropdown ms-auto dropdownLayout">
    <!-- Your dropdown content goes here -->
  </div>
</div> `
  }
  else {
    headerContent = `
      <span title="Liste des photos" id="listPhotosCmd">
        <img src="images/PhotoCloudLogo.png" class="appLogo">
      </span>
      <span class="viewTitle">${title}
        </span

        <div class="headerMenusContainer">
         
         
          <div class="dropdown ms-auto dropdownLayout">

          </div>
        </div>
    `;
  }
  $("#header").html(headerContent);
}
//#endregion

//#region //////////////////////////////////renders///////////////////////////////////////////////////////////////

function renderModifyPersonnage() {}

function logout() {
  API.logout();
  $(".popup").hide();

  isAdmin = false;
  isConnected = false;
  loggedUser = null;
  renderLogin();
  loginMessage = "";
}
function timedOut() {
  API.logout();

  isAdmin = false;
  isConnected = false;
  loggedUser = null;
  $(".popup").hide();
  loginMessage = "Votre session est expirer! Veuillez vous reconnecter.";
  renderLogin();
}
function renderAbout() {
  saveContentScrollPosition();
  eraseContent();
  updateHeader("A propos...");
  timeout();

  $("#content").append(
    $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `)
  );
  if (isConnected) {
    dropDownUsers(isAdmin);
  } else {
    dropDownAnonymous();
  }
}
function renderLogin(loginMessage = '', Email = '', EmailError = '', passwordError = '') {
    saveContentScrollPosition();
    eraseContent();
    updateHeader('Connexion');
    noTimeout();

    restoreContentScrollPosition();

    let loginContent = `
        <div class="content" style="text-align:center">
            <h3 class="loginMessage">${loginMessage}</h3>
            <form class="form" id="loginForm">
                <input type='email' name='Email' class="form-control" required 
                    placeholder="adresse de courriel" value='${Email}'>
                <span style='color:red'>${EmailError}</span>
                <input type='password' name='Password' placeholder='Mot de passe'
                    class="form-control" required>
                <span style='color:red'>${passwordError}</span>
                <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
            </form>
            <div class="form">
                <hr>
                <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
            </div>
        </div>
    `;


    $("#content").append($(loginContent));

    $("#loginForm").on('submit', function (e) {
        e.preventDefault();
        let email = $("input[name='Email']").val();
        let password = $("input[name='Password']").val();

        API.login(email, password).then((user) => {
            if (user) {
                if (user.VerifyCode !== "verified") 
                {
                    renderEmailVerification();
                } else
                 {


                    if (
                        user.Authorizations["readAccess"] !== -1 &&
                        user.Authorizations["writeAccess"] !== -1
                    ) {
                        isAdmin =
                            user.Authorizations["readAccess"] === 2 &&
                            user.Authorizations["writeAccess"] === 2;

                        isConnected = true;
                        loggedUser = user;
                        API.storeLoggedUser(user);
                        dropDownUsers(isAdmin);
                        renderPhotos();
                    } else {
                        loginMessage = "Vous etes blocker";
                        renderLogin();
                    }
                }
            }
            else {
                if (API.currentStatus == 482) {
                    renderLogin("", email,"","Mot de passe incorrect");
                } else if (API.currentStatus == 481) {
                    renderLogin("", '', 'Courriel introuvable', '');
                } else {
                    renderProbleme();
                }
            }
        });
    });

    $("#createProfilCmd").on('click', function () {
        renderInscription();
    });

    restoreContentScrollPosition();

}

function updateLoginMessage(message) {
    $(".loginMessage").text(message);
}
function renderInscription() {
    noTimeout();
    eraseContent(); 
    updateHeader("Inscription");
    $("#newPhotoCmd").hide(); 
    $("#content").append(`
    <form class="form" id="createProfilForm">
    <fieldset>
        <legend>Adresse courriel</legend>
        <input type="email" class="form-control Email" name="Email" id="Email" placeholder="Courriel" required RequireMessage='Veuillez entrer votre courriel' InvalidMessage='Courriel invalide' CustomErrorMessage="Ce courriel est déjà utilisé"/>
        <input class="form-control MatchedInput" type="text" matchedInputId="Email" name="matchedEmail" id="matchedEmail" placeholder="Vérification" required RequireMessage='Veuillez entrez de nouveau votre courriel' InvalidMessage="Les courriels ne correspondent pas" />
    </fieldset>
    <fieldset>
        <legend>Mot de passe</legend>
        <input type="password" class="form-control" name="Password" id="Password" placeholder="Mot de passe" required RequireMessage='Veuillez entrer un mot de passe' InvalidMessage='Mot de passe trop court'/>
        <input class="form-control MatchedInput" type="password" matchedInputId="Password" name="matchedPassword" id="matchedPassword" placeholder="Vérification" required InvalidMessage="Ne correspond pas au mot de passe" />
    </fieldset>
    <fieldset>
        <legend>Nom</legend>
        <input type="text" class="form-control Alpha" name="Name" id="Name" placeholder="Nom" required RequireMessage='Veuillez entrer votre nom' InvalidMessage='Nom invalide'/>
    </fieldset>
    <fieldset>
        <legend>Avatar</legend>
        <div class='imageUploader' newImage='true' controlId='Avatar' imageSrc='images/no-avatar.png' waitingImage="images/Loading_icon.gif"></div>
    </fieldset>
    <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
</form>
<div class="cancel">
    <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
</div>`);
    
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on('click', function() {
        renderLogin(); 
    }); 
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');

    $('#createProfilForm').on("submit", function (event) {
        let profil = getFormData($('#createProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();
        showWaitingGif(); 
        createProfil(profil); 
        });
        
}

    function getFormData($form) {
        let unindexedArray = $form.serializeArray();
        let indexedArray = {};
    
        $.map(unindexedArray, function(n, i) {
            indexedArray[n['name']] = n['value'];
        });
    
        return indexedArray;
    }
    function createProfil(profilData) {
    
        API.register(profilData).then((response) => {
            console.log("API.register response:", response);
    
            if (response) {
                renderLogin("Votre compte a ete cree. Veuillez prendre vos courriels pour reccuperer votre code de verification qui vous sera demander");
            } else {
                    renderProbleme();
            }
        }).catch((error) => {
            console.error(error);
        });
    
    }
    
    
    
    
    $(document).ready(function () {
        initTimeout(timeBeforeRedirect, timedOut);
    
        let user = API.retrieveLoggedUser();
    
        if (user != null) {
            if (user.Authorizations["readAccess"] !== -1 && user.Authorizations["writeAccess"] !== -1) {
                isConnected = true;
                loggedUser = user;
                isAdmin = user.Authorizations["readAccess"] === 2 && user.Authorizations["writeAccess"] === 2;
    
                if (user.VerifyCode !== "verified") {
                    renderEmailVerification();
                } else {
                    renderPhotos();
                }
            } else {
                renderLogin();
                loginMessage = "Blocked user";
            }
        } else {
            renderLogin();
        }
    });
    

setInterval(() => {
  let user = API.retrieveLoggedUser();
  //console.log("tour");
  //console.log(user.Authorizations);
  if (user != null) {
    if (
      user.Authorizations["readAccess"] === -1 &&
      user.Authorizations["writeAccess"] === -1
    ) {
      renderLogin();
      loginMessage = "You have been blocked";
    }
  }
}, 1000);

function dropDownAnonymous() {
  let content = `<div data-bs-toggle="dropdown" aria-expanded="false">
    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
    </div>
    <div class="dropdown-menu noselect">
    <span class="dropdown-item" id="loginCmd">
    <i class="menuIcon fa fa-sign-in mx-2"></i>
    Connexion
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="aboutCmd">
    <i class="menuIcon fa fa-info-circle mx-2"></i>
    À propos...
    </span>
    </div>`;

  $(".dropdown").html(content);
  renderCmds();
}
function renderGestionPersonnage() {
  saveContentScrollPosition();
  eraseContent();z
  updateHeader("Gestion des usagers");
  timeout();

  API.GetAccounts()
    .then((response) => {
      if (response && response.data && Array.isArray(response.data)) {
        const users = response.data;
        if (users.length > 0) {
          users.forEach((user) => {
            if (user.Id != loggedUser.Id) {
              $("#content").append(renderUser(user));
            }
          });
          restoreContentScrollPosition();
        } else {
          console.error("Error: No user accounts found.");
        }

        dropDownUsers(isAdmin);
      } else {
        console.error("Error: Unexpected API response format.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user accounts:", error);
    });
}
function renderUser(user) {
  let userRank = `<span class="adminCmd fas fa-user-alt dodgerblueCmd" adminuser_id="${user.Id}" title="Ajouter comme admin ${user.Name}"></span>`;
  let userStatus = `<span class="blockCmd fa-regular fa-circle greenCmd" blockuser_id="${user.Id}" title="Blocker ${user.Name}"></span>`;

  if (
    user.Authorizations["readAccess"] === 2 &&
    user.Authorizations["writeAccess"] === 2
  )
    userRank = `<span class="unAdminCmd fas fa-user-cog dodgerblueCmd" unadminuser_id="${user.Id}" title="Enlever comme admin ${user.Name}"></span>`;

  if (
    user.Authorizations["readAccess"] === -1 &&
    user.Authorizations["writeAccess"] === -1
  )
    userStatus = `<span class="unBlockCmd fa fa-ban redCmd" unblockuser_id="${user.Id}" title="Deblocker ${user.Name}"></span>`;

  return `
  <div class="UserRow" User_id="${user.Id}">
  <div class="UserContainer noselect">
    <div class="UserLayout">
      <div class="UserAvatar" style="background-image:url('${user.Avatar}')"></div>
      <div class="UserInfo">
        <span class="UserName">${user.Name}</span>
        <a href="mailto:${user.Email}" class="UserEmail" target="_blank">${user.Email}</a>
      </div>
    </div>
    <div class="UserCommandPanel">
      ${userRank}
      ${userStatus}
      <span class="deleteCmd fas fa-user-slash goldenrodCmd" deleteuser_id="${user.Id}" title="Effacer ${user.Name}"></span>
    </div>
  </div>
</div>
  `;
}
function renderPhotos() {
  saveContentScrollPosition();
  eraseContent();
  updateHeader("Liste de photos");
  dropDownUsers(isAdmin);

  timeout();

  let photosContent = `
   <h1> Photos </h1>
`;

  $("#content").append($(photosContent));
}

function dropDownUsers(isAdmin) {
  let content;
  if (isAdmin) {
    content = `<div data-bs-toggle="dropdown" aria-expanded="false">
    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
    </div>
    <div class="dropdown-menu noselect">
    <span class="dropdown-item" id="manageUserCm">
    <i class="menuIcon fas fa-user-cog mx-2"></i>
    Gestion des usagers
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="logoutCmd">
    <i class="menuIcon fa fa-sign-out mx-2"></i>
    Déconnexion
    </span>
    <span class="dropdown-item" id="editProfilMenuCmd">
    <i class="menuIcon fa fa-user-edit mx-2"></i>
    Modifier votre profil
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="listPhotosMenuCmd">
    <i class="menuIcon fa fa-image mx-2"></i>
    Liste des photos
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="sortByDateCmd">
    <i class="menuIcon fa fa-check mx-2"></i>
    <i class="menuIcon fa fa-calendar mx-2"></i>
    Photos par date de création
    </span>
    <span class="dropdown-item" id="sortByOwnersCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-users mx-2"></i>
    Photos par créateur
    </span>
    <span class="dropdown-item" id="sortByLikesCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-user mx-2"></i>
    Photos les plus aiméés
    </span>
    <span class="dropdown-item" id="ownerOnlyCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-user mx-2"></i>
    Mes photos
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="aboutCmd">
    <i class="menuIcon fa fa-info-circle mx-2"></i>
    À propos...
    </span>
    </div>`;
  } else {
    content = `<div data-bs-toggle="dropdown" aria-expanded="false">
    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
    </div>
    <div class="dropdown-menu noselect">
    <span class="dropdown-item" id="logoutCmd">
    <i class="menuIcon fa fa-sign-out mx-2"></i>
    Déconnexion
    </span>
    <span class="dropdown-item" id="editProfilMenuCmd">
    <i class="menuIcon fa fa-user-edit mx-2"></i>
    Modifier votre profil
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="listPhotosMenuCmd">
    <i class="menuIcon fa fa-image mx-2"></i>
    Liste des photos
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="sortByDateCmd">
    <i class="menuIcon fa fa-check mx-2"></i>
    <i class="menuIcon fa fa-calendar mx-2"></i>
    Photos par date de création
    </span>
    <span class="dropdown-item" id="sortByOwnersCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-users mx-2"></i>
    Photos par créateur
    </span>
    <span class="dropdown-item" id="sortByLikesCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-user mx-2"></i>
    Photos les plus aiméés
    </span>
    <span class="dropdown-item" id="ownerOnlyCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-user mx-2"></i>
    Mes photos
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="aboutCmd">
    <i class="menuIcon fa fa-info-circle mx-2"></i>
    À propos...
    </span>
    </div>`;
  }
  $(".dropdown").html(content);
  renderCmds();
}
function renderCmds() {
  $("#aboutCmd").on("click", function () {
    showWaitingGif();
    renderAbout();
  });
  $("#loginCmd").on("click", function () {
    showWaitingGif();
    renderLogin();
  });
  $("#manageUserCm").on("click", function () {
    showWaitingGif();
    renderGestionPersonnage();
  });
  $("#editProfilMenuCmd").on("click", function () {
    showWaitingGif();
    renderModifyPersonnage();
  });
  $("#logoutCmd").on("click", function () {
    showWaitingGif();
    logout();
    renderLogin();
  });
  $("#listPhotosCmd").on("click", function () {
    showWaitingGif();
    if (!isConnected) {
      renderLogin();
    } else renderPhotos();
  });
  $("#listPhotosMenuCmd").on("click", function () {
    showWaitingGif();
    if (!isConnected) {
      renderLogin();
    } else renderPhotos();
  });
  $(".adminCmd").on("click", function () {
    showWaitingGif();
    const userId = $(this).attr("adminuser_id");
    API.admin(userId);
    renderGestionPersonnage();
  });
  $(".unAdminCmd").on("click", function () {
    showWaitingGif();
    const userId = $(this).attr("unadminuser_id");
    API.unadmin(userId);
    renderGestionPersonnage();
  });
  $(".blockCmd").on("click", function () {
    showWaitingGif();
    const userId = $(this).attr("blockuser_id");
    API.block(userId);
    renderGestionPersonnage();
  });
  $(".unBlockCmd").on("click", function () {
    showWaitingGif();
    const userId = $(this).attr("unblockuser_id");
    API.unblock(userId);
    renderGestionPersonnage();
  });
  $(".deleteCmd").on("click", function () {
    showWaitingGif();
    const userId = $(this).attr("deleteuser_id");
    API.unsubscribeAccount(userId);
    renderGestionPersonnage();
  });
}

function renderEmailVerification() {
    eraseContent();
    updateHeader("Verification");
    let verificationContent = `
        <div class="content" style="text-align:center">
            <h3>Veuillez entrer le code de verification que vous avez recu par courriel</h3>
            <form class="form" id="verificationForm">
                <input type='text' name='verifyCode' class="form-control" required 
                    placeholder="Verification Code">
                <input type='submit' name='submit' value="Verify" class="form-control btn-primary">
            </form>
        </div>
    `;
    $("#content").append($(verificationContent));

    $("#verificationForm").on('submit', function(e) {
        e.preventDefault();
        let verifyCode = $("input[name='verifyCode']").val();
        API.verifyEmail(loggedUser.Id, verifyCode).then((isValid) => {
            if (isValid) {
                renderLogin();
            } else {
                renderEmailVerification();
            }
        });
    });
}

    function renderModifyPersonnage() {
        saveContentScrollPosition();
        eraseContent();
        updateHeader("Profil");

        let modifierProfilContent = `
            <form class="form" id="editProfilForm">
                <input type="hidden" name="Id" id="Id" value="${loggedUser.Id}"/>
                <fieldset>
                    <legend>Adresse ce courriel</legend>
                    <input type="email" class="form-control Email" name="Email" id="Email" placeholder="Courriel" required RequireMessage='Veuillez entrer votre courriel' InvalidMessage='Courriel invalide' CustomErrorMessage="Ce courriel est déjà utilisé" value="${loggedUser.Email}">
                    <input class="form-control MatchedInput" type="text" matchedInputId="Email" name="matchedEmail" id="matchedEmail" placeholder="Vérification" required RequireMessage='Veuillez entrez de nouveau votre courriel' InvalidMessage="Les courriels ne correspondent pas" value="${loggedUser.Email}">
                </fieldset>
                <fieldset>
                    <legend>Mot de passe</legend>
                    <input type="password" class="form-control" name="Password" id="Password" placeholder="Mot de passe" InvalidMessage='Mot de passe trop court'>
                    <input class="form-control MatchedInput" type="password" matchedInputId="Password" name="matchedPassword" id="matchedPassword" placeholder="Vérification" InvalidMessage="Ne correspond pas au mot de passe">
                </fieldset>
                <fieldset>
                    <legend>Nom</legend>
                    <input type="text" class="form-control Alpha" name="Name" id="Name" placeholder="Nom" required RequireMessage='Veuillez entrer votre nom' InvalidMessage='Nom invalide' value="${loggedUser.Name}">
                </fieldset>
                <fieldset>
                    <legend>Avatar</legend>
                    <div class='imageUploader' newImage='false' controlId='Avatar' imageSrc='${loggedUser.Avatar}' waitingImage="images/Loading_icon.gif"></div>
                </fieldset>
                <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
            </form>
            <div class="cancel">
                <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
            </div>
            <div class="cancel"> <hr>
            <button class="form-control btn-warning" id="deleteAccountBtn">Effacer le compte</button>
            </div>`;

        $("#content").append($(modifierProfilContent));

        initFormValidation();
        initImageUploaders();
        addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');

        $('#editProfilForm').on('submit', function(e) {
            e.preventDefault();
            let updatedProfil = getFormData($('#editProfilForm'));
            delete updatedProfil.matchedPassword;
            delete updatedProfil.matchedEmail;
            API.modifyUserProfil(updatedProfil).then(response => {
                
                if (response) {
                    API.storeLoggedUser(response); 
                } else {
                }
            }).catch(error => {
                console.error('Error:', error);
            });

        });

        $('#abortCmd').on('click', function() {
            renderPhotos();
        });
        $('#deleteAccountBtn').on('click', function() {
            renderConfirmDeleteProfil();
        });
        restoreContentScrollPosition();
    }
function renderConfirmDeleteProfil() {
    eraseContent();
    updateHeader("Retrait de compte");

    let confirmDeleteContent = `
    <div class="confirmDeleteContainer center">
    <h2 class="viewTitle">Voulez-vous vraiment effacer votre compte?</h2>
    <div class="form confirmForm">
      <button class="form-control btn-danger" id="confirmDeleteBtn">Effacer mon compte</button><br>
      <button class="form-control btn-secondary" id="cancelDeleteBtn">Annuler</button>
    </div>
  </div>
    `;

    $("#content").append($(confirmDeleteContent));

    $("#confirmDeleteBtn").on('click', function() {
        API.unsubscribeAccount(loggedUser.Id).then((isDeleted) => {
            if (isDeleted) {
                logout();
                renderLogin("Votre compte a été supprimé avec succès.");
            } else {
                renderModifyPersonnage();
            }
        });
    });

    $("#cancelDeleteBtn").on('click', function() {
        renderModifyPersonnage();
    });
}

  
function renderProbleme() {
    saveContentScrollPosition();
    eraseContent();
    updateHeader("Problème");

    let serverErrorContent = `
        <div class="content" style="text-align:center">
            <div class="errorContainer">
                <h2>Le serveur ne répond pas</h2>
                </div>
            <hr>
            <div class="cancel">
                <button class="form-control btn-primary" id="connexion">Connexion</button>
                </div>
        </div>
    `;

    $("#content").append($(serverErrorContent));

    $('#connexion').on('click', function() {
        renderLogin();
    });

    restoreContentScrollPosition();
}

//#endregion
