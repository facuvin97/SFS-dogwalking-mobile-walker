import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Badge, IconButton, Portal } from 'react-native-paper';
import { useNotificationsContext } from '../contexts/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';

const Notifications = () => {
  const { notifications, markAsRead } = useNotificationsContext();
  const [isVisible, setIsVisible] = useState(false); // Controla la visibilidad de las notificaciones
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Actualiza el conteo de notificaciones no leídas cada vez que cambian las notificaciones
    setUnreadCount(notifications.filter((notification) => !notification.leido).length);
  }, [notifications]);

  const toggleNotifications = async () => {
    if (isVisible) {
      // Si la lista está abierta y se va a cerrar, marca todas las no leídas como leídas
      const unreadNotifications = notifications.filter((notification) => !notification.leido);
      await Promise.all(unreadNotifications.map((notification) => markAsRead(notification.id)));
    }
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleNotifications}>
        <View>
          {unreadCount > 0 && <Badge style={styles.badge}>{unreadCount}</Badge>}
          <IconButton icon="bell" size={30} />
        </View>
      </TouchableOpacity>
      <Portal>
      {isVisible && (
        <View style={styles.notificationsContainer}>
          {notifications.length === 0 ? (
            <Text style={styles.noNotifications}>No hay notificaciones disponibles</Text>
          ) : (
            <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollViewContent} 
            showsVerticalScrollIndicator={true} // Mostrar la barra de scroll
          >
            {notifications.map((notification) => (
              <View
              key={notification.id}
              style={[
                styles.notificationItem,
                notification.leido ? styles.readNotification : styles.unreadNotification,
              ]}
            >
              <View>
                <Text style={styles.notificationTitle}>{notification.titulo}</Text>
                <Text style={styles.notificationContent}>{notification.contenido}</Text>
                <Text style={styles.notificationTime}>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}</Text>
              </View>
            </View>
            ))}
          </ScrollView>
          )}
        </View>
      )}
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: 'red',
    color: 'white',
  },
  flatListContainer: {
    flex: 1, // Permite que el FlatList ocupe espacio dentro del contenedor
  },
  notificationsContainer: {
    position: 'absolute',
    top: 120,
    right: 0,
    width: 300,
    maxHeight: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    zIndex: 9999,
    
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readNotification: {
    backgroundColor: '#f5f5f5',
  },
  unreadNotification: {
    backgroundColor: '#e0f7fa',
  },
  notificationTitle: {
    fontWeight: 'bold',
  },
  notificationContent: {
    color: '#555',
  },
  notificationTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  noNotifications: {
    textAlign: 'center',
    color: '#888',
  },
  markAsReadIcon: {
    marginLeft: 10,
  },
  scrollView: {
    flex: 1, // Asegura que ScrollView ocupe todo el espacio disponible
  },
  scrollViewContent: {
    flexGrow: 1, // Permite que ScrollView maneje correctamente el contenido
  },
});

export default Notifications;
