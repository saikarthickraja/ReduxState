import React, {useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Card, IconButton, Button, Dialog, Portal} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {removeCard} from '../redux/cardSlice';

const CardItem = ({card, onEdit}) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);

  return (
    <>
      <LinearGradient
        colors={['#e3f2fd', '#bbdefb']}
        style={styles.cardGradient}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.name}>{card.name}</Text>
              <Text style={styles.number}>
                CCV: **** **** **** {card.number.slice(-4)}
              </Text>
              <Text style={styles.expiry}>Expiry: {card.expiry}</Text>
            </View>
            <View style={styles.actions}>
              <IconButton
                icon={() => (
                  <MaterialCommunityIcons
                    name="pencil"
                    size={26}
                    color="#007bff"
                  />
                )}
                style={styles.iconButton}
                onPress={() => onEdit(card)}
              />
              <IconButton
                icon={() => (
                  <MaterialCommunityIcons name="delete" size={26} color="red" />
                )}
                style={styles.iconButton}
                onPress={() => setVisible(true)}
              />
            </View>
          </View>
        </Card>
      </LinearGradient>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>
            Confirm Deletion
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Are you sure you want to delete "{card.name}"?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="contained"
              onPress={() => setVisible(false)}
              style={styles.noButton}
              labelStyle={styles.buttonText}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                dispatch(removeCard(card.id));
                hideDialog();
              }}
              style={styles.yesButton}
              labelStyle={styles.buttonText}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  cardGradient: {
    borderRadius: 12,
    margin: 12,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  number: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  expiry: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 50,
    marginHorizontal: 4,
  },
  dialog: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  dialogTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dialogText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
  dialogActions: {
    justifyContent: 'space-around',
    paddingBottom: 12,
  },
  noButton: {
    backgroundColor: '#757575',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  yesButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CardItem;
