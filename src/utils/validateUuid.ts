export default function isUUID ( uuid: string ) {
  let s = "" + uuid;

  const match = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

  if (match === null) {
    return false;
  }
  return true;
}
