export const serviceBindingModal = (props) =>
  import('./ServiceBindingModal' /* webpackChunkName: "create-service-binding-modal" */).then((m) =>
    m.createServiceBindingModal(props),
  );
