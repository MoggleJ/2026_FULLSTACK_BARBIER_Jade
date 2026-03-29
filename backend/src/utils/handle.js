/**
 * Enveloppe un handler Express async.
 * Les erreurs lancées par les services (avec .status) sont renvoyées au client.
 * Les erreurs inattendues sont loguées et renvoient 500.
 */
export function handle(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (!err.status) console.error(err);
      res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
    }
  };
}
