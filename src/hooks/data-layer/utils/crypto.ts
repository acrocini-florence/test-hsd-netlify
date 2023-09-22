import md5 from "crypto-js/md5";
import sha256 from "crypto-js/sha256";

export function getHashedString(str: string = "") {
  return {
    md5: md5(str).toString(),
    sha256: sha256(str).toString(),
  };
}
