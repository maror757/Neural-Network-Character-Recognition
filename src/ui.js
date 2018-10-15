var div = document.createElement('div');
div.id = 'status';
document.body.appendChild(div);

const statusElement = document.getElementById('status');

export function log(message) {
  div.innerText = 'Status text:'
  statusElement.innerText += message;
}
