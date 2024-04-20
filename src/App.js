import { useState } from "react";

const initialFriends = [
  // {
  //   id: 118836,
  //   name: "Domen",
  //   image: "https://i.pravatar.cc/48?u=118836",
  //   balance: -7,
  // },
  // {
  //   id: 933372,
  //   name: "Klara",
  //   image: "https://i.pravatar.cc/48?u=933372",
  //   balance: 20,
  // },
  {
    id: 1,
    name: "Oseba",
    image: "https://www.w3schools.com/howto/img_avatar.png",
    balance: 0,
  },
];
export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  // FUNKCIJA KI NA KLIK ODPRE ALI ZAPRE DODAJ PRIJATELJA GUMB
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(friend) {
    // vzamemo trenutne prijatelje in naredimo novi array in jim dodamo novega prijatelja
    setFriends((friends) => [...friends, friend]);
    // ponovno zapre zavihek ko vnesemo prijatelja
    setShowAddFriend(false);
  }
  // funckija ki se pokliče kadar kliknemo gumb izberi in nato pkliče trenutnega prijatelja ki ga kliknemo
  function handleSelection(friend) {
    // kadar je trenutno izbran prijatelj je enako friend.id potem pomeni da je dejansko odprt zavihek za račun drugače se zavihek zapre ker je null
    setSelectedFriend((currentFriend) =>
      currentFriend?.id === friend.id ? null : friend
    );
    // avtomatsko zapre zavihek za dodaj prijatelja ko kliknemo izberi prijatelja
    setShowAddFriend(false);
  }
  // funkcija za razdelitev računa
  function handleSplitBill(value) {
    // novi array ki ga naredimo je based na current based friends in hočemo vrnit novi array z isto dolzino kot trenutni array zato .map in loopamo čez array v katerem je vsak objekt friend in potem updejtamo friend vsakič ko je currentfriend enako selectedfriend
    // če je trenutni prijatelj tisti ki ga hočemo udpejtat vrnemo objekt ki vrne vse elemente trenutnega prijatelja ampak hočemo overrajtat balance property če pa trenutni friend ni tisti ki ga hočemo updejtat vrnemo nespremenjen friend
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    // ponastavi zavihek oziroma ga zapre
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {/* avtomatsko skrije add friend polje z && operatorjem */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        {/* ČE JE SHOWADDFRIEND TRUE PRIKAZE ZAPRI ZAVIHEK DRUGAČE DODAJ PRIJATELJA */}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Zapri zavihek" : "Dodaj prijatelja"}
        </Button>
      </div>
      {/* ČE PRIJATELJ NI IZBRAN SE SPLIT BILL ZAVIHEK AVTOMATSKO SKRIJE DOKLER NE IZBEREMO PRIJATELJA */}
      {/* z selected friend = selected friend nastimamo text v splitbill zavihku, ki ga nato kot propse prenesmo spodaj v formsplitbill */}
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

// ONCLICK PROPS PRENESEMO IZ BUTTON ELEMENTA V APPU V BUTTON FUNKCIJO
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}


function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/150");

  function handleSubmit(e) {
    // PREPREČI STRANI DA SE PONOVNO NALOZI OB KLIKU DODAJ PRIJATELJA
    e.preventDefault();
    // random generira id
    const id = crypto.randomUUID();
    // če ni slike in ni imena se ne izvede spodnja funkcija dodajanja prijatelja
    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image: `${image}?${id}`,
      balance: 0,
    };
    setName("");
    setImage("https://i.pravatar.cc/48");
    // dodaj novega prijatelja
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👨🏾‍🤝‍👨🏾Ime prijatelja</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼URL slike</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Dodaj</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    // če ni vrednosti za račun in plačilo potem se ne izvede klik na gumb funkcija
    if (!bill || !paidByUser) return;
    // če je vrednost paidbyfriend je vrednost pozitivna drugače je ngativna ker si dolžan plačati prijatelju račun
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Razdeli si račun z {selectedFriend.name}</h2>
      <label>💸 Vrednost računa</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧑 Tvoji stroški</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            // prepreči da so expensi večji od računa, ker preprosto to ni mogoče in se neda vtipkati večjo vrednost od računa
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>🧍‍♂️{selectedFriend.name} stroški</label>
      <input type="text" disabled value={paidByFriend} />
      <Button>Razdeli račun</Button>
      <label>🤑 Kdo plača račun?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">Ti</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
    </form>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          onSelection={onSelection}
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          Tvojemu prijatelju {friend.name} dolguješ {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          Tvoj prijatelj {friend.name} ti dolguje {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && (
        <p>Ti in {friend.name} si ne dolgujeta ničesar</p>
      )}
      {/* kadarkoli kliknemo sedaj gumb vzame trenutnega prijatelja ter ga shrani v selected friend state */}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Zapri" : "Izberi"}
      </Button>
    </li>
  );
}
