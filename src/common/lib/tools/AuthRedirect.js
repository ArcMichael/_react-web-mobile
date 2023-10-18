function AuthRedirect(WL) {
  WL.href = `/login?historyLocation=${encodeURIComponent(WL.pathname.replace("/", "")) + WL.search.replace("?", "&")}`;
}

export default AuthRedirect;
