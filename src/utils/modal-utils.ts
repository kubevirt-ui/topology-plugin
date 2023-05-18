// Helper to detect if a modal is open. This is used to disable autofocus in elements under a modal.
// TODO: Improve focus and keybinding handling, see https://issues.redhat.com/browse/ODC-3554
export const isModalOpen = () => document.body.classList.contains('ReactModal__Body--open');
