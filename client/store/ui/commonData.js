import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logo: "",
  contactNumber: "",
  facebookLink: "",
  twitterLink: "",
  linkedInLink: "",
  instagramLink: "",
  loading: false,
};

const slice = createSlice({
  name: "commonData",
  initialState,
  reducers: {
    loadingCommonData: (state, action) => {
      state.loading = action.payload;
    },
    setCommonData: (state, action) => {
      const {
        logo = "",
        facebookLink = "",
        twitterLink = "",
        linkedInLink = "",
        instagramLink = "",
        contactNumber = "",
        loginModalImage = "",
        registerModalImage = "",
      } = action.payload;
      state.logo = logo;
      state.contactNumber = contactNumber;
      state.facebookLink = facebookLink;
      state.twitterLink = twitterLink;
      state.linkedInLink = linkedInLink;
      state.instagramLink = instagramLink;
      state.loginModalImage = loginModalImage;
      state.registerModalImage = registerModalImage;
    },
  },
});

export default slice.reducer;
export const { loadingCommonData, setCommonData } = slice.actions;
