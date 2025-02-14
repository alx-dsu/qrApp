import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// export const Home = (props) => (
//   <MaterialIcons name="home" size={24} color="black" {...props} />
// );
export const Info = (props) => (
  <MaterialIcons name="info" size={24} color="black" {...props} />
);
export const InfoOut = (props) => (
  <MaterialIcons name="info-outline" size={24} color="black" {...props} />
);

export const Home = (props) => <Ionicons name="home" size={24} color="black" />;
export const HomeOut = (props) => (
  <Ionicons name="home-outline" size={24} color="black" />
);

const Icons = ({ name, ...props }) => {
  return <MaterialIcons name={name} {...props} />;
};

export default Icons;
