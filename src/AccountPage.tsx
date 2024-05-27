// import { AuthUser } from "aws-amplify/auth";

function AccountPage({
  // user,
  signOut,
}: {
  // user: AuthUser | undefined;
  // eslint-disable-next-line
  signOut: ((data?: any | undefined) => void) | undefined;
}) {
  // function welcomeText(): string {
  //   let text = "Welcome";
  //   if (user?.userId) {
  //     text += " " + user.userId + "!";
  //   } else {
  //     text += "!";
  //   }
  //   return text;
  // }

  return (
    <div>
      <h2>Account page</h2>
      <br />
      <br />
      <br />
      {/* <h3>{welcomeText()}</h3>
      <br />
      <br /> */}
      <p>Ability to create artist name coming soon.</p>
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
