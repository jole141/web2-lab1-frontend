import { admins } from "./constants/admin";
import axios from "axios";

export function convertTimestampToDate(timestamp: string) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${day}.${month}.${year} ${hour}:${minute}`;
}

export async function isUserAdmin(token: string) {
  const tokenInfoResponse = await axios.get(
    `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return admins.includes(tokenInfoResponse.data.name);
}
