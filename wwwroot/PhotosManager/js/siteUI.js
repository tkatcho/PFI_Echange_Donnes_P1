let contentScrollPosition = 0;
let isAdmin = false;
let isConnected = false;
let loggedUser;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
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
  } else {
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
  renderCmds();
}

//#region //////////////////////////////////renders///////////////////////////////////////////////////////////////
function renderAbout() {
  timeout();
  saveContentScrollPosition();
  eraseContent();
  updateHeader("A propos...");

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
  dropDownUsers(isAdmin);
}
function renderLogin() {
  saveContentScrollPosition();
  eraseContent();
  updateHeader("Connexion");
  dropDownAnonymous();
  let loginMessage = "";
  let Email = "";
  let EmailError = "";
  let passwordError = "";

  let loginContent = `
        <div class="content" style="text-align:center">
            <h3>${loginMessage}</h3>
            <form class="form" id="loginForm">
                <input type='email' name='Email' class="form-control" required 
                    RequireMessage = 'Veuillez entrer votre courriel'
                    InvalidMessage = 'Courriel invalide'
                    placeholder="adresse de courriel"
                    value='${Email}'>
                <span style='color:red'>${EmailError}</span>
                <input type='password' name='Password' placeholder='Mot de passe'
                    class="form-control" required 
                    RequireMessage = 'Veuillez entrer votre mot de passe'>
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

  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    let email = $("input[name='Email']").val();
    let password = $("input[name='Password']").val();

    API.login(email, password).then((user) => {
      if (user) {
        isAdmin =
          user.Authorizations["readAccess"] === 2 &&
          user.Authorizations["writeAccess"] === 2;
        isConnected = true;
        loggedUser = user;
        renderPhotos();
        dropDownUsers(isAdmin);
        timeout();
      } else {
        $("h3").text("Erreur");
      }
    });
  });

  $("#createProfilCmd").on("click", function () {
    renderInscription();
  });

  restoreContentScrollPosition();
}
function renderInscription() {
  saveContentScrollPosition();
  eraseContent();
  updateHeader("Inscription");

  let registerContent = `
    <form class="form" id="createProfilForm"'>
    <fieldset>
    <legend>Adresse ce courriel</legend>
    <input type="email"
    class="form-control Email"
    name="Email"
    id="Email"
    placeholder="Courriel"
    required
    RequireMessage = 'Veuillez entrer votre courriel'
    InvalidMessage = 'Courriel invalide'
    CustomErrorMessage ="Ce courriel est déjà utilisé"/>
    <input class="form-control MatchedInput"
    type="text"
    matchedInputId="Email"
    name="matchedEmail"
    id="matchedEmail"
    placeholder="Vérification"
    required
    RequireMessage = 'Veuillez entrez de nouveau votre courriel'
    InvalidMessage="Les courriels ne correspondent pas" />
    </fieldset>
    <fieldset>
    <legend>Mot de passe</legend>
    <input type="password"
    class="form-control"
    name="Password"
    id="Password"
    placeholder="Mot de passe"
    required
    RequireMessage = 'Veuillez entrer un mot de passe'
    InvalidMessage = 'Mot de passe trop court'/>
    <input class="form-control MatchedInput"
    type="password"
    matchedInputId="Password"
    name="matchedPassword"
    id="matchedPassword"
    placeholder="Vérification" required
    InvalidMessage="Ne correspond pas au mot de passe" />
    </fieldset>
    <fieldset>
    <legend>Nom</legend>
    <input type="text"
    class="form-control Alpha"
    name="Name"
    id="Name"
    placeholder="Nom"
    required
    RequireMessage = 'Veuillez entrer votre nom'
    InvalidMessage = 'Nom invalide'/>
    </fieldset>
    <fieldset>
    <legend>Avatar</legend>
    <div class='imageUploader'
    newImage='true'
    controlId='Avatar'
    imageSrc='images/no-avatar.png'
    waitingImage="images/Loading_icon.gif">
    </div>
    </fieldset>
    <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
    </form>
    <div class="cancel">
    <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>`;

  $("#content").append($(registerContent));

  $("#createProfilCmd").on("click", function () {});
  $("#abortCmd").on("click", function () {
    renderLogin();
  });

  restoreContentScrollPosition();
}
$(document).ready(function () {
  renderLogin();
});

function logout() {}
function renderModifyPersonnage() {}

function renderGestionPersonnage() {
  timeout();
  saveContentScrollPosition();
  eraseContent();
  updateHeader("Gestion des usagers");

  API.GetAccounts()
    .then((response) => {
      if (response && response.data && Array.isArray(response.data)) {
        const users = response.data;

        console.log(users);

        if (users.length > 0) {
          users.forEach((user) => {
            $("#content").append(renderUser(user));
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

function addAdmin(){

}
function removeAdmin(){
  
}
function blockUser(){
  
}
function unBlockUser(){
  
}

function removeUser(userId){

}
function renderCmds() {
  $("#aboutCmd").on("click", function () {
    renderAbout();
  });
  $("#loginCmd").on("click", function () {
    renderLogin();
  });
  $("#manageUserCm").on("click", function () {
    renderGestionPersonnage();
  });
  $("#editProfilMenuCmd").on("click", function () {
    renderModifyPersonnage();
  });
  $("#logoutCmd").on("click", function () {
    logout();
    renderLogin();
  });
  $("#listPhotosCmd").on("click", function () {
    if (!isConnected) {
      renderLogin();
    } else renderPhotos();
  });

  $("#adminCmd").on("click", function () {
    addAdmin();
  });
  $("#unAdminCmd").on("click", function () {
    removeAdmin();
  });
  $("#blockCmd").on("click", function () {
    blockUser();
  });
  $("#unBlockCmd").on("click", function () {
    unBlockUser();
  });
  $("#deleteCmd").on("click", function () {
    const userId = $(this).attr("deleteuser_id");
          
    deleteUser(userId);
  });
}
//#endregion
