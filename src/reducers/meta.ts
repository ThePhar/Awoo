import Meta from "../structs/meta";
import { MetaActions } from "../interfaces/meta-actions";
import produce from "immer";

export default function metaReducer(state: Meta = new Meta(), action: MetaActions): Meta {
    return produce(state, draft => {
        console.log(action, draft); // TODO: Write actual code!
    });
}
