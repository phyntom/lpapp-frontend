import notify from 'devextreme/ui/notify';

class FeedBack {
  triggerMessage(type, message, duration) {
    switch (type) {
      case 'success':
        notify(message, 'success', duration);
        break;
      case 'error':
        notify(message, 'error', duration);
        break;
      case 'warning':
        notify(message, 'warning', duration);
        break;
      default:
        notify(message, 'error', duration);
        break;
    }
  }
}

export default new FeedBack();
