import React, { useReducer } from "react";
import { useState } from "react";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { fetchCityAndState } from '../Service/service';
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  Pressable,
  Animated,
  useWindowDimensions,
  Modal,
  TextInput
} from "react-native";
import Loader from "@/Component/Loader";
const landingImage = require("../assets/LandingImage1.png");
const signUpOrSignInImage = require("../assets/createAcc.png");

const initialState = {
  name: "",
  email: "",
  profilePic: "",
  password: "",
  confirmPassword: "",
  contactNumber: "",
  city: "",
  state: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SET_CONTACT_NUMBER":
      return { ...state, contactNumber: action.payload };
    case "SET_PROFILE_PICTURE":
      return {...state, profilePic: action.payload };
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_STATE":
      return { ...state, state: action.payload };
    default:
      return state;
  }
}

const Welcome = () => {
  const { height, width } = useWindowDimensions();
  const animateView = useState(new Animated.Value(-height))[0];
  const [isModalVisible, setisModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pin, setPin] = useState("");
  const [step, setStep] = useState(1);
  const [loader, setLoader] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 1) {
      return state.name.trim() !== "" && state.contactNumber.trim() !== "" && state.contactNumber.trim().length == 10;
    }
    if (step === 2) {
      // return state.city.trim() !== "" && state.state.trim() !== "";
      return true
    }
    return true;
  };

  const isValidPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) return false;
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
  
    return passwordRegex.test(password);
  };

  function start() {
    Animated.timing(animateView, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }

  const fetchAddress = async () => {
    try {
      setLoader(true);
      const { city, state } = await fetchCityAndState(pin);
      dispatch({ type: 'SET_CITY', payload: city });
      dispatch({ type: 'SET_STATE', payload: state });
    } catch (error) {
      console.error('Error fetching city and state:', error);
    } finally {
      setLoader(false);
    }
  }

  const signUpOrSignIn = () => {
    setisModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={start}>
        <ImageBackground
          source={landingImage}
          style={{ height: "100%", width: "100%" }}
          resizeMode="cover"
        />
      </Pressable>
      <Animated.View style={[styles.welcomeBox, { bottom: animateView }]}>
        <Text style={styles.textLanding}>Find everything you need</Text>
        <Text style={styles.summaryText}>
          Lets start with accessing your account.
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.input}
            onChangeText={(val) => setEmail(val)}
            value={email}
            placeholder="Email id"
            autoComplete="email"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          <TextInput
            style={styles.input}
            onChangeText={(val) => setPassword(val)}
            value={password}
            placeholder="Password"
            autoComplete="email"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            secureTextEntry={true}
          />
          <Pressable
            disabled={!email.trim().length || !password.trim().length}
            style={({ pressed }) => [
              styles.signInSignUp,
              (!email.trim() || !password.trim()) && styles.disabledButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
        </View>
        <View style={{ margin: 10 }}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => signUpOrSignIn()}
          >
            <Text style={styles.buttonText}>Don't have an account?</Text>
          </Pressable>
        </View>
      </Animated.View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setisModalVisible(!isModalVisible);
        }}
        presentationStyle="pageSheet"
      >
        { loader ? <Loader /> : null }
        {/* Wrapping everything inside a View */}
        <View style={{ flex: 1 }}>
          {/* ImageBackground is now absolutely positioned */}
          <ImageBackground
            source={signUpOrSignInImage}
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
            }}
            resizeMode="cover"
          />

          {/* This View will contain the TextInput and Button */}
          <View style={[styles.modalView, { zIndex: 1 }]}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 700,
                textAlign: "center",
                paddingBottom: "40",
                marginTop: 40,
              }}
            >
              Lets create an account for you!
            </Text>
            <ProgressSteps activeStep={step - 1}>
              {/* Step 1: Name and Contact Number */}
              <ProgressStep label="Name & Contact" removeBtnRow>
                <View style={styles.stepContainer}>
                  <Text>Enter Name:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(val) =>
                      dispatch({ type: "SET_NAME", payload: val })
                    }
                    value={state.name}
                    placeholder="Enter Name"
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    secureTextEntry={false}
                  />

                  <Text>Enter Contact Number:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(val) =>
                      dispatch({ type: "SET_CONTACT_NUMBER", payload: val })
                    }
                    value={state.contactNumber}
                    placeholder="Enter Contact Number"
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    keyboardType="phone-pad"
                  />

                  <Text>Your Profile pic:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(val) =>
                      dispatch({ type: "SET_PROFILE_PICTURE", payload: val })
                    }
                    value={state.profilePic}
                    placeholder="URL (Optional)"
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    keyboardType="phone-pad"
                  />
                </View>
              </ProgressStep>

              {/* Step 2: City and State */}
              <ProgressStep label="City & State" removeBtnRow>
                <View style={styles.stepContainer}>      
                  <Text>Enter PIN to fill City and State:</Text>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' , width : "55%" }} >
                    <TextInput
                      style={[styles.input,{ width: '70%' }]}
                      onChangeText={(val) => setPin(val)}
                      value={pin}
                      placeholder="Enter PIN"
                      placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    />
                    <Pressable
                      style={[styles.button, { width : '20%' }]}
                      onPress={() => fetchAddress()}
                    >
                      <Text style={styles.buttonText}>S</Text>
                    </Pressable>
                  </View>
                  <Text>Your City:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(val) =>
                      dispatch({ type: "SET_CITY", payload: val })
                    }
                    editable={false}
                    value={state.city}
                    placeholder="Enter City"
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  />
                  <Text>Your State:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(val) =>
                      dispatch({ type: "SET_STATE", payload: val })
                    }
                    editable={false}
                    value={state.state}
                    placeholder="Enter State"
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  />
                </View>
              </ProgressStep>

              {/* Step 3: Password and Confirm Password */}
              <ProgressStep label="Password" removeBtnRow>
                <View style={styles.stepContainer}>
                  <Text>Create a Password:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(val) =>
                      dispatch({ type: "SET_PASSWORD", payload: val })
                    }
                    value={state.password}
                    placeholder="Enter Password"
                    secureTextEntry
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  />

                  <Text>Confirm Password:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(val) =>
                      dispatch({ type: "SET_CONFIRM_PASSWORD", payload: val })
                    }
                    value={state.confirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  />

                  {state.password && state.confirmPassword && !isValidPassword(state.password, state.confirmPassword) && (
                    <Text style={{ color: 'black', textAlign : 'center', textShadowColor: 'black', textShadowRadius : 1, padding : 20 }}>
                      Passwords must match and include upper, lower, number & special char.
                    </Text>
                  )}
                </View>
              </ProgressStep>
            </ProgressSteps>

            <View style={styles.buttonContainer}>
              {step > 1 && (
                <Pressable style={styles.button} onPress={prevStep}>
                  <Text style={styles.buttonText}>Back</Text>
                </Pressable>
              )}
              {step < 3 && (
                <Pressable style={[styles.button, !isStepValid() && styles.disabledButton]} onPress={nextStep} disabled={!isStepValid()}>
                  <Text style={styles.buttonText}>Next</Text>
                </Pressable>
              )}
              {step === 3 && (
                <Pressable
                  style={[
                    styles.button,
                    !isValidPassword(state.password, state.confirmPassword) && styles.disabledButton,
                  ]}
                  disabled={!isValidPassword(state.password, state.confirmPassword)}
                  onPress={() => console.log("Submitted", state)}
                >
                  <Text style={styles.buttonText}>
                    Submit
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={styles.button}
                onPress={() => setisModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeBox: {
    height: "50%",
    width: "100%",
    backgroundColor: "#768E7F",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    display: "flex",
    justifyContent: "center",
  },
  textLanding: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    paddingBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: 400,
    textAlign: "center",
    paddingBottom: 5,
  },
  button: {
    backgroundColor: "#0D3029",
    paddingVertical: 10,
    width: "70%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    marginBottom: 10,
  },
  signInSignUp: {
    backgroundColor: "#354542",
    paddingVertical: 10,
    width: "40%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  buttonPressed: {
    opacity: 0.4,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    width: "50%",
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 10,
  },
  orText: {
    fontSize: 25,
    color: "white",
    textDecorationStyle: "dashed",
    fontWeight: 600,
  },
  seperator: {
    borderBlockColor: "white",
    width: "100%",
    borderWidth: "1",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    marginBottom: 125,
  },
  stepContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Welcome;
