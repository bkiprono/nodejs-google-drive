// const jwt_decode = require('jwt-decode');

function authorize() {
  //accessing the drive API
  const CLIENT_ID = '110813112101-3ifbmhntarh5p4o5b3lu7efpk9erla07.apps.googleusercontent.com';
  // const API_KEY = 'AIzaSyDs7evd5ESfWTnqoaXsDmQMFJXLJz_3j54';
  // const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  // const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

  const google = window.google;
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: async (response) => {
      const { credential } = response;
      console.log({ credential });
      //console.log(response);
      // const userObject = jwt_decode(credential);
      //console.log(userObject);
      // localStorage.setItem('user', JSON.stringify(userObject));
      // const { name, sub, picture } = userObject;
      // const doc = {
      //   _id: sub,
      //   _type: 'user',
      //   userName: name,
      //   image: picture,
      // };
      // const decoded = this.decodeJwt(credential);

      // const User = await AlinkeoUser.FromUser(
      //   { hostId: decoded.sub, promptUserIfNull: false },
      //   this.config.apiURL,
      //   this.getUserByHostId.bind(this)
      // );
      // User.setAuthToken({ token: credential, provider: 'google' });

      // await this.setUser(User);
      return credential;
    },
  });
  google.accounts.id.prompt();
};

function getFiles() {

}