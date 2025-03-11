import React, {useState} from 'react';
import {FlatList, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  Button,
  TextInput,
  Modal,
  Portal,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {addCard, updateCard} from '../redux/cardSlice';
import CardItem from '../components/CardItem';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'gray',
    text: 'blue',
    placeholder: 'gray',
    background: 'white',
  },
};

const CardManager = () => {
  const dispatch = useDispatch();
  const cardList = useSelector(state => state.cards.cardList);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [cardData, setCardData] = useState({
    id: '',
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const validateForm = () => {
    let newErrors = {};
    if (!cardData.name.trim()) newErrors.name = 'Cardholder name is required';
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(cardData.number))
      newErrors.number = 'Enter a valid 16-digit card number';
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry))
      newErrors.expiry = 'Enter a valid expiry date (MM/YY)';
    if (!/^\d{3}$/.test(cardData.cvv))
      newErrors.cvv = 'Enter a valid 3-digit CVV';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateCard = () => {
    if (!validateForm()) return;
    if (isEditing) {
      dispatch(updateCard({id: cardData.id, updatedCard: cardData}));
    } else {
      dispatch(addCard({...cardData, id: Date.now().toString()}));
    }
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setCardData({id: '', name: '', number: '', expiry: '', cvv: ''});
    setErrors({});
    setTouchedFields({});
    setIsEditing(false);
  };

  const formatCardNumber = text =>
    text
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})/g, '$1 ')
      .trim();

  const formatExpiryDate = text =>
    text
      .replace(/\D/g, '')
      .slice(0, 4)
      .replace(/(\d{2})(\d{0,2})/, '$1/$2');

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <FlatList
          data={cardList}
          renderItem={({item}) => (
            <CardItem
              card={item}
              onEdit={card => {
                setCardData(card);
                setIsEditing(true);
                setModalVisible(true);
              }}
            />
          )}
          keyExtractor={item => item.id}
        />
        <Button
          mode="contained"
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
          style={styles.addButton}>
          Add Card
        </Button>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Card' : 'Add Card'}
            </Text>

            <TextInput
              label="Cardholder Name"
              value={cardData.name}
              onBlur={() => setTouchedFields(prev => ({...prev, name: true}))}
              onChangeText={text => setCardData({...cardData, name: text})}
              style={styles.input}
              error={touchedFields.name && !!errors.name}
            />
            {touchedFields.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <TextInput
              label="Card Number"
              value={cardData.number}
              keyboardType="numeric"
              maxLength={19}
              onBlur={() => setTouchedFields(prev => ({...prev, number: true}))}
              onChangeText={text =>
                setCardData({...cardData, number: formatCardNumber(text)})
              }
              style={styles.input}
              error={touchedFields.number && !!errors.number}
            />
            {touchedFields.number && errors.number && (
              <Text style={styles.errorText}>{errors.number}</Text>
            )}

            <View style={styles.row}>
              <TextInput
                label="Expiry Date"
                value={cardData.expiry}
                keyboardType="numeric"
                maxLength={5}
                onBlur={() =>
                  setTouchedFields(prev => ({...prev, expiry: true}))
                }
                onChangeText={text =>
                  setCardData({...cardData, expiry: formatExpiryDate(text)})
                }
                style={[styles.input, styles.halfInput]}
                error={touchedFields.expiry && !!errors.expiry}
              />
              <TextInput
                label="CVV"
                value={cardData.cvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                onBlur={() => setTouchedFields(prev => ({...prev, cvv: true}))}
                onChangeText={text =>
                  setCardData({...cardData, cvv: text.replace(/\D/g, '')})
                }
                style={[styles.input, styles.halfInput]}
                error={touchedFields.cvv && !!errors.cvv}
              />
            </View>

            <TouchableOpacity
              onPress={handleAddOrUpdateCard}
              style={styles.saveButton}>
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, backgroundColor: '#FAFAFA'},
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 5,
    fontSize: 28,
  },
  modalContainer: {
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {marginBottom: 12, backgroundColor: 'white', color: 'red'},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  halfInput: {flex: 0.48},
  saveButton: {
    marginTop: 15,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
  },
  saveButtonText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {color: 'red', fontSize: 14, marginTop: -8, marginBottom: 8},
});

export default CardManager;
