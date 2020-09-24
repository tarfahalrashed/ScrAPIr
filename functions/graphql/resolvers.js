const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
const foldersRef = admin.database().ref('folders');
module.exports = {
  Query: {
    folders() {
      return foldersRef.once('value')
        .then(snapshot => {
          const folders = snapshot.val();
          if (folders === null) return [];
          return Object.keys(folders).map(o => Object.assign({ id: o }, folders[o]));
        });
    },
  },
  Mutation: {
    createFolder(_, { input }) {
      return (
        new Promise((resolve) => {
          const folder = foldersRef.push(input, () => {
            resolve(Object.assign({ id: folder.key }, input)
            );
          });
        })
      );
    },
    updateFolder(_, { input }) {
      const folderRef = foldersRef.child(input.id);
      return folderRef.once('value')
        .then(snapshot => {
          const folder = snapshot.val();
          if (folder === null) throw new Error('404');
          return folder;
        })
        .then((folder) => {
          const update = Object.assign(folder, input);
          delete update.id;
          return folderRef.set(update).then(() => (Object.assign({ id: input.id }, update)));
        });
    },
    deleteFolder(_, { input }) {
      const folderRef = foldersRef.child(input.id);
      return folderRef.once('value')
        .then((snapshot) => {
          const folder = snapshot.val();
          if (folder === null) throw new Error('404');
          return Object.assign({ id: input.id }, folder);
        })
        .then(folder => folderRef.remove().then(() => (folder)));
    }
  }
};
