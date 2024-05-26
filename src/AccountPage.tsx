function AccountPage({
  signOut,
}: {
  // eslint-disable-next-line
  signOut: ((data?: any | undefined) => void) | undefined;
}) {
  return (
    <div>
      <h2>Account page</h2>
      <br />
      <br />
      <button
        onClick={() => {
          if (signOut) signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default AccountPage;
