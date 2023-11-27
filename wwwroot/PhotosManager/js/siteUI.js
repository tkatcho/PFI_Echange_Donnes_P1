let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
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
    let headerContent = `
        <div class="headerMenusContainer">
            <img src="../PhotosManager/favicon.ico" alt="App Logo" class="app-logo">
            <div class="viewTitle">${title}</div>
        </div>
    `;

    $("#header").html(headerContent);
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    UpdateHeader("À propos...", "about");

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
        `))
}

function renderLogin() {
    saveContentScrollPosition();
    eraseContent();
    updateHeader('Connexion');
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

    $("#loginForm").on('submit', function(e) {
        e.preventDefault();
        let email = $("input[name='Email']").val();
        let password = $("input[name='Password']").val();
    
        API.login(email, password).then(user => {
            if(user) {
 
                renderPhotos(); 
                
            } else {
                
                $("h3").text("Erreur");
            }
        });
    });

    $("#createProfilCmd").on('click', function() {
        renderInscription(); 
    });

    restoreContentScrollPosition();
}


function renderInscription() {
    saveContentScrollPosition();
    eraseContent();
    updateHeader('Inscription');
   

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


    $("#createProfilCmd").on('click', function() {
    });
    $("#abortCmd").on('click', function() {
        renderLogin(); 
    });


    restoreContentScrollPosition();
}

$(document).ready(function() {
    renderLogin();
}); 


function renderPhotos() {
    saveContentScrollPosition();
    eraseContent();
    updateHeader('Liste de photos'); 
    let photosContent = `
   <h1> Photos </h1>
`;

$("#content").append($(photosContent));

}
