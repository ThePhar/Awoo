import { createStore } from "redux";
import metaReducer from "../../reducers/meta";
import Meta from "../../structs/meta";

let store: ReturnType<typeof createStore>;
beforeEach(() => {
    store = createStore(metaReducer);
});

it("should create an initial meta object on store creation", () => {
    expect(store.getState()).toBeInstanceOf(Meta);
});
