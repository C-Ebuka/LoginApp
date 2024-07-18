import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const NotesScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); 
  const [notes, setNotes] = useState(''); 

  useEffect(() => {
    // Check if a user is authenticated
    const unsubscribe = auth().onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        await loadUserNotes(userAuth.uid); // Load user's notes based on UID
      } else {
        navigation.navigate('Login'); // Redirect to login screen if no user is logged in
      }
    });

    return unsubscribe; // Clean up listener on unmount
  }, []);

  const loadUserNotes = async (uid) => {
    try {
      const notesRef = firestore().collection('notes').doc(uid);
      const doc = await notesRef.get();
      if (doc.exists) {
        setNotes(doc.data().notes || ''); // Set user's notes if document exists
      } else {
        setNotes(''); // Initialize notes if document does not exist
      }
    } catch (error) {
      console.error('Error loading user notes:', error);
      Alert.alert('Error', 'Failed to load user notes.');
    }
  };

  const saveUserNotes = async () => {
    try {
      const notesRef = firestore().collection('notes').doc(user.uid);
      await notesRef.set({ notes });
      Alert.alert('Success', 'Notes saved successfully.');
    } catch (error) {
      console.error('Error saving user notes:', error);
      Alert.alert('Error', 'Failed to save user notes.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', error.message);
    }
  };

  const addEditor = async () => {
    try {
      const { uid } = user; // Current user's UID
      const editorEmail = 'editor@example.com'; // Replace with the email of the user you want to add as editor

      // Check if the editor's email exists
      const editorQuery = await firestore().collection('users').where('email', '==', editorEmail).get();
      if (editorQuery.empty) {
        Alert.alert('Editor not found', `No user found with email ${editorEmail}`);
        return;
      }

      // Get the editor's UID
      const editorUid = editorQuery.docs[0].id;

      // Add editor to the user's editors list in Firestore
      const userRef = firestore().collection('users').doc(uid);
      await userRef.update({
        editors: firestore.FieldValue.arrayUnion(editorUid)
      });

      Alert.alert('Success', `Added ${editorEmail} as editor.`);
    } catch (error) {
      console.error('Error adding editor:', error);
      Alert.alert('Error', 'Failed to add editor.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome {user ? user.email : ''}</Text>
      <Text>Notes Screen</Text>
      <TextInput
        placeholder="Write your notes here..."
        multiline
        numberOfLines={4}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: '80%' }}
        value={notes}
        onChangeText={setNotes}
      />
      <Button
        title="Save Notes"
        onPress={saveUserNotes}
      />
      <Button
        title="Add Editor"
        onPress={addEditor}
      />
      <Button
        title="Logout"
        onPress={handleLogout}
      />
    </View>
  );
};

export default NotesScreen;
