# Module 5 Homework

Now that we have an awesome lottery app, our CTO and Tech Lead decided to fully use the potential of the selected technologies. The plan is to embrace a wide spectrum of functionalities by using the advanced patterns known in React community. They’re so satisfied with React Native that they want you to extend app functionalities, by adding the details screen and proper error handling. Based on the experience CTO also mentioned that it would be perfect to keep in mind the performance of the app, especially when taking into consideration their further plans to extend the app.

### Homework management :house:

The final result of all homework is the React Native Application full of features implemented iteratively in the end phase of each module in the course. In order to keep consistency and track all of your changes we highly recommend you to create your own GitHub repository where your work as a participant will be stored. Your GitHub repository should be shared with all trainers, which will enable us to verify your work and communicate:
- Wiktor Szlegier: https://github.com/Wiiktor22
- Adam Trzciński: https://github.com/adamTrz
- Mariusz Pasiński: https://github.com/mani3xis 

### The goal of this module’s homework

The goal of this homework is to build the details screen for the lottery and the sorting functionality for the lottery list using various topics learned from this part of the course such as react hooks, react context, and render props pattern.

### Starting point

You should be able to continue working on the same homework project but if you don’t have it available or you want to start fresh here is a starting point for this homework:

https://github.com/callstack-workshops/abbott-module-5-homework

### Checkpoints :bulb:

The homework repository contains periodic checkpoints for your convenience. You will see callouts denoting the current checkpoint throughout this instruction. They will look something like this:

> :bulb: You are now here → `checkpoint-xyz`

Feel free to check out the corresponding branch of any given checkpoint if you’re struggling or simply want to compare your solution with ours.

With that out of the way, let’s start!

## Part 1: Details Screen

Let’s implement the details screen for lotteries.

<details>
  <summary><b>Step 1: Create new folder</b></summary><br>
  Create a simple function component to use as a LotteryDetails screen

  ```tsx
  import { StyleSheet, View } from 'react-native';

  export const LotteryDetails = () => {
    return <View style={styles.container}></View>;
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
  });
  ```
</details>

<details>
  <summary><b>Step 2. Add created screen to the app navigation structure</b></summary><br>
  
  In the `App.tsx` file add a `Stack.Screen`:

  ```tsx
  import { LotteryDetails } from './screens/LotteryDetails';

<Stack.Navigator>
   <Stack.Group>
    // ...
	  <Stack.Screen
      name="LotteryDetails"
      component={LotteryDetails}
	    options={options}
	  />
	</Stack.Group>
	// ...
</Stack.Navigator>
  ```

  Remember about adding the `LotteryDetails` type property to the existing navigation types:
  
  *We will pass in the lottery ID to fetch data about specific lottery as a route param.*

  ```ts
  export type RootStackParamList = {
    Home: undefined;
    AddLottery: undefined;
    Register: { selectedLotteries: Array<string> };
    LotteryDetails: { id: string }; // <- Include this line
  };
  ```
</details>

<details>
  <summary><b>Step 3. Add a pressable component to the lottery name in order to navigate to the details screen</b></summary><br>

  In order to give user feedback after pressing the lottery name on the `HomeScreen` we will use the `TouchableOpacity` component from the React Native library. 

    :bulb: On press down, the opacity of the wrapped view is decreased, dimming it.

  Let’s modify the `LotteryList` component by adding the `useNavigation` hook and by overlapping the lottery name with `TouchableOpacity`. To the button component, we have to pass in the `onPress` prop with the navigate action.

  ```tsx
  const LotteryList = ({ ... }) => {
	const navigation = useNavigation<LotteryDetailsNavigationProp>();

	const renderItem = ({ item }: { item: Lottery }) => {
		//...
		return (
			<Pressable>
				{...}
                <TouchableOpacity
                accessibilityRole="button"
                onPress={() => navigation.navigate('LotteryDetails', { id: item.id })
                >
                    <Text style={styles.name}>{item.name}</Text>
                </TouchableOpacity>
				{...}
			</Pressable>
		)
	}
}
  ```

  Don’t forget to create navigation prop type:

  ```ts
  export type LotteryDetailsNavigationProp = StackNavigationProp<
    RootStackParamList,
    'LotteryDetails'
  >;
  ```
</details>

<details>
  <summary><b>Step 4. Create a useLotteryDetails hook to fetch data about the single lottery</b></summary><br>

  First of all let’s add the getLotteryById action to the lottery service.

  ```ts
  export async function getLotteryById(lotteryId: string) {
    try {
        const response = await fetch(`${API_URL}/lottery/${lotteryId}`);

        const body: Awaited<Lottery> = await response.json();

        return body;
    } catch (error) {
        console.error(error);

        throw error;
    }
}
  ```

  Create a `useLotteryDetails` hook based on the `useLotteries` hook to fetch lottery details.

  ```tsx
import { useEffect, useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';

export function useLotteryDetails(lotteryId: string) {
    const [lottery, setLottery] = useState<Lottery | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const fetchLottery = async (id: string) => {
        setLoading(true);
        setError(undefined);

        try {
            const data = await LotteryService.getLotteryById(id);
            setLoading(false);
            setLottery(data);
        } catch (e: any) {
            setLoading(false);
            setError(e.message);
        }
    };

    useEffect(() => {
        fetchLottery(lotteryId);
    }, [lotteryId]);

    return {
        data: lottery,
        loading,
        error,
        fetchLottery,
    };
}
  ```
</details>

<details>
  <summary><b>Step 5. Introduce a render props pattern inside of the `LotteryDetails` screen by creating the `DataProvider` and View components</b></summary><br>

  Let’s see the `render props` pattern in action, thanks to that we will build a complex and universal approach to organizing a screen. In order to implement mentioned pattern we will need a `Screen` component that will use the `render prop` pattern, `Data Provider` Component, and a `View` component.

  Let’s start by building the `Data Provider` component, that will accept `children` prop and the `lottery ID`. For that, we will use the previously created `useLotteryDetails` hook, responsible for fetching information about the single lottery.

  In the `LotteryDetailsDataProvider` we can wait until the data will be fetched by displaying the `Loader` component. If we already have `data` we can render our children and pass down the fetched data.

    Remember to also validate if the data is existing. 
    If the `loading` flag is set to `false`, and the `data` property is still being assigned to a `null` value - some error had to occur, we will handle that part later on…

  ```tsx
/* ----- DATA PROVIDER ----- */

interface LotteryDetailsDataProviderProps {
    children: (lotteryDetails: Lottery) => ReactElement;
    lotteryId: string;
}

const LotteryDetailsDataProvider = ({
    children,
    lotteryId,
}: LotteryDetailsDataProviderProps) => {
    const { data, loading } = useLotteryDetails(lotteryId);

    if (loading) return <Loader />;
    return data ? children(data) : null;
};
  ```

  After that we need to also build simple View component, which will accept lottery as a prop.

  ```tsx
  interface LotteryDetailsViewProps {
    lottery: Lottery;
}

const LotteryDetailsView = ({ lottery }: LotteryDetailsViewProps) => {
    return (
        <View style={styles.container}></View>
    );
};
  ```

  Finally we can modify our screen component to use the render prop pattern like so:

    Remember to pass in the lottery ID, that we have received as a route prop from HomeScreen.

  ```tsx
  /* ----- SCREEN ----- */

export const LotteryDetails = () => {
    const route = useRoute<LotteryDetailsRouteProp>();

    return (
        <LotteryDetailsDataProvider lotteryId={route.params.id}>
            {(lotteryDetails) => <LotteryDetailsView lottery={lotteryDetails} />}
        </LotteryDetailsDataProvider>
    );
};
  ```
</details>

<details>
  <summary><b>Step 6. Build a simple UI to display all information about the lottery</b></summary><br>
  In the final step we can extend a bit our detail view to display full range of information. We will not implement anything specific since this task was focused on the `render prop` pattern, but feel free to modify the UI however you like!

  <img width="400" alt="ui" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/19f3f9cd-839c-47d6-ad5e-de5e798ad628" />


  Example code implementation: 

  ```tsx
/* ----- VIEW ----- */

const renderTextRow = (title: string, value: string): ReactElement => {
    const prefix = `${title}: `;
    return (
        <View style={styles.textRow}>
            <Text>
                {prefix}
                <Text style={styles.boldText}>{value}</Text>
            </Text>
        </View>
    );
};

interface LotteryDetailsViewProps {
    lottery: Lottery;
}

const LotteryDetailsView = ({ lottery }: LotteryDetailsViewProps) => {
    const { id, name, prize, status, type } = lottery;
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{name}</Text>
            {renderTextRow('ID', id)}
            {renderTextRow('Price', prize)}
            {renderTextRow('Status', status)}
            {renderTextRow('Type', type)}
        </View>
    );
};
  ```
</details>

> :bulb: You are now here → [`part-1`](https://github.com/callstack-workshops/abbott-module-5-homework/tree/part-1)

## Part 2:  Error Boundaries for the Details Screen

Let’s add the Error Boundary component to the LotteryDetails screen.

<details>
  <summary><b>Step 1: Implement the Fallback component for the LotteryDetails screen.</b></summary><br>

  Let’s start the task by creating an error screen:

  <img width="400" alt="ui" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/6686b418-7d57-4add-8235-e15f06daafe9" />

  ```tsx
 import { StyleSheet, View, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../colors';

export const LotteryDetailsError = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Ionicons name="warning-outline" size={48} color="black" />
            <Text style={styles.whoopsText}>Whoops...!</Text>
            <Text style={styles.regularText}>Something went wrong!</Text>
            <Text style={styles.regularText}>
                We were unable to load your lottery...
            </Text>
            <View style={styles.button}>
                <Button title="Navigate back" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingHorizontal: 12,
        textAlign: 'center',
    },
    whoopsText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginVertical: 20,
        marginLeft: 10,
    },
    regularText: {
        fontSize: 16,
    },
    button: {
        marginTop: 20,
    },
});
  ```
</details>

<details>
  <summary><b>Step 2. Create Error Boundary component</b></summary><br>

  Let’s implement the ErrorBoundary component:

  ```tsx
import React, { PropsWithChildren, ReactNode } from 'react';

type ErrorBoundaryProps = PropsWithChildren<{
    fallback: ReactNode;
}>;

type ErrorBoundaryState = {
    hasError: boolean;
};

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        console.error(error);
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
        // You can render any custom fallback UI
        return this.props.fallback;
        }

        return this.props.children;
    }
}
  ```
</details>

<details>
  <summary><b>Step 3. Add the Error Boundary component to the LotteryDetails component</b></summary><br>

  Now we have to applied that component to the `LotteryDetails` screen like so:

  ```tsx
// LotteryDetails.tsx
// ...

const fallback = <LotteryDetailsError />;

export const LotteryDetails = () => {
    const route = useRoute<LotteryDetailsRouteProp>();

    return (
        <ErrorBoundary fallback={fallback}>
            <LotteryDetailsDataProvider lotteryId={route.params.id}>
                {(lotteryDetails) => <LotteryDetailsView lottery={lotteryDetails} />}
            </LotteryDetailsDataProvider>
        </ErrorBoundary>
    );
};
  ```
</details>

<details>
  <summary><b>Step 4. Test the Error Boundary component</b></summary><br>

  In order to test the Error Boundary component we have to introduce some error on the component level. Let’s put the below `useEffect` hook in the implementation of the `LotteryDetailsDataProvider` component:

  ```tsx
useEffect(() => {
    throw new Error();
});
  ```

  Now you should be able to see the newly implemented fallback screen, while entering the `LotteryDetails` screen! **Remember to remove the above useEffect after tests!**


</details>

> :bulb: You are now here → [`part-2`](https://github.com/callstack-workshops/abbott-module-5-homework/tree/part-2)

## Part 3:  React DevTools

Let’s analyze how components inside of `LotteryDetails` screen are re-rendering and why. For that purpose, we will profile the transition between `HomeScreen` and `LotteryDetails` screen.

<details>
  <summary><b>Installation</b></summary><br>

  The easiest way to use React Developer Tools with React Native app is to install it globally:

    # Yarn
    yarn global add react-devtools

    # Npm
    npm install -g react-devtools

  After the installation, open developer tools from the the terminal

    react-devtools

  It should connect to any local React Native app that’s running.

  > :bulb: Try reloading the app if developer tools doesn’t connect after a few seconds.
</details>

<details>
  <summary><b>Step 1. Profile the transition between the HomeScreen and LotteryDetails screen</b></summary><br>

  First of all, navigate to the `HomeScreen` in the app.

Switch off to the Profiler tab and start to record by pressing one of the blue recording buttons.

<img width="800" alt="Zrzut ekranu 2023-07-25 o 08 25 50" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/53f839df-f071-40ec-b4c2-3b372d764c1c">

Then open the `LotteryDetails` screen in the app by pressing the lottery name.

After the performed transition, and visible  `LotteryDetails` screen we can stop the recording by pressing one of the stop buttons:

<img width="800" alt="Zrzut ekranu 2023-07-25 o 08 28 09" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/e17f942a-e72e-4a93-82f7-263f41256d70">

</details>

<details>
  <summary><b>Step 2. Analyze the results of the collected recording</b></summary><br>

  <img width="800" alt="Zrzut ekranu 2023-07-25 o 08 40 31" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/9a513073-a4f2-4dcf-b865-35019d38dda7">
  
  As you can see we have recorded three commits. Let’s analyze what has happened there:

  ************************First Commit************************

The very first commit was triggered from the `BaseNavigationContainer`, so the performed by us transition has been started. As you can see below we have branches below the Native Stack Navigator related components:

<img width="763" alt="Zrzut ekranu 2023-07-25 o 08 44 41" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/24b91bd9-4d88-4141-8392-a9734c39206f">

The first is all about the HomeScreen and the second one is related to the LotteryDetails screen, as we can see the LotteryDetails screen is being rendered for the first time

<img width="800" alt="Zrzut ekranu 2023-07-25 o 08 50 23" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/c2b60539-7366-4a20-8fe2-d2886638333e">


************Second commit************

Let’s jump to the second commit where we can see that the LotteryDetails component itself was not re-rendered, but the implemented by us LotteryDetailsDataProvider was:

<img width="800" alt="Zrzut ekranu 2023-07-25 o 08 53 33" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/d7da5e9f-66a0-495f-bcc3-2833f4e38524">

The re-render took almost 36 ms and we see the reason behind it, the hook 2 changed. Notice also that we’re in the loading state currently since the Loader component is being displayed! 

By switching to the Components tab we can see what hook has a number 2 in the `LotteryDetailsDataProvider`. It is the second `useState` hook inside of the `useLotteryDetails` hook:

<img width="369" alt="Zrzut ekranu 2023-07-25 o 08 56 06" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/7087568c-0a8b-4a44-8e5e-2fdd9f10b86c">

Let’s switch to the third commit and let’s see how the structure of components below the LotteryDetails screen component has changed. As we can see the LotteryDetailsView has been rendered, meaning the data has been successfully fetched from the internet and passed into the view: 

<img width="800" alt="Zrzut ekranu 2023-07-25 o 09 06 27" src="https://github.com/callstack-workshops/abbott-module-5-homework/assets/50460088/42c90299-fe5a-4edc-b95b-f8574c0871e2">

Take a look at what hook is signed as a number 1 in the `LotteryDetailsDataProvider` component
</details>

<details>
  <summary><b>Step 3. As a practice try to record and analyze the re-renders after selecting the lottery and opening the Register modal</b></summary><br>

  Try to have a precise look what is causing particular re-renders, whether the state changes, context, or hooks? 

Explore also selecting lotteries functionality.
</details>

## Part 4:  Add sorting functionality to the lotteries list with the usage of React Context

Let’s add sorting functionality to the lotteries list inside of HomeScreen using React Context. We will sort lotteries by the prices, we will implement functionality to sort them ascending and descending.

<details>
  <summary><b>Step 1. Implement Lotteries Sorting Context with the Provider component</b></summary><br>

  Let’s start the implementation by preparing the necessary types we will use:

1. First of all, let’s create an enum that will be used to represent the current sorting option.
2. Second of all, we need to provide an interface that will be representing the selected sorting option property and the function to switch the sorting.

```ts
export enum LotteryListSortingOptions {
  Ascending,
  Descending,
}

interface LotteriesSortingContextValue {
  selectedSorting: LotteryListSortingOptions;
  switchSorting: DispatchWithoutAction;
}
```

After that we can implement the Provider. In order to keep the state inside of the React context we will use the useReducer hook. Our state will be represent by the above created LotteryListSortingOptions. For that purpose we also have to write a simple function which will toggle the state, so it can be passed to useReducer hook.

```ts
const sortingReducer = (state: LotteryListSortingOptions) => {
  return state === LotteryListSortingOptions.Ascending
    ? LotteryListSortingOptions.Descending
    : LotteryListSortingOptions.Ascending;
};

export const LotteriesSortingContextProvider = () => {
	const [selectedSorting, switchSorting] = useReducer(
    sortingReducer,
    LotteryListSortingOptions.Ascending,
  );

	// Code to be added...
}
```

We will be using a convenient wrapper our the React Context Provider so it’s now time to put there the Provider component. The Provider we are building will be accepting children as prop so we can treat as an regular wrapper component. We have to also build a value object which will be implementing the `LotteriesSortingContextValue` interface we have just built. 

The example wrapper for the Provider may look like this:

```ts
interface LotteriesSortingContextProviderProps {
  children: JSX.Element;
}

export const LotteriesSortingContextProvider = ({
  children,
}: LotteriesSortingContextProviderProps) => {
  const [selectedSorting, switchSorting] = useReducer(
    sortingReducer,
    LotteryListSortingOptions.Ascending,
  );

  const value: LotteriesSortingContextValue = {
    selectedSorting,
    switchSorting,
  };

  return (
    <LotteriesSortingContext.Provider value={value}>
      {children}
    </LotteriesSortingContext.Provider>
  );
};
```
</details>

<details>
  <summary><b>Step 2. Implement the useLotteriesSortingContext hook to get the context value</b></summary><br>

  In order to achieve that goal we will use the `useContext` hook from React, to which we have to pass created by us context. If the context is reachable it means that the `useLotteriesSortingContext`  hook have been used in the allowed area of provided context, otherwise we can’t use the context and we will throw an Error with the specified reason why - informing that we’re out of the scope. 

```ts
export const useLotteriesSortingContext = () => {
  const context = useContext(LotteriesSortingContext);

  if (context === undefined) {
    throw new Error(
      'useLotteriesSortingContext must be used within a LotteriesSortingContextProvider',
    );
  }

  return context;
};
```
</details>

<details>
  <summary><b>Step 3. Apply created provider to the HomeScreen</b></summary><br>

  In this step we will use the Context we just built. We just need to overlap the created provider like so:

```tsx
return (
	<LotteriesSortingContextProvider>
        <View style={styles.container}>
            <TouchableOpacity
                accessibilityRole="button"
                onPress={() => navigation.navigate('Register', { selectedLotteries })}
                style={[styles.button, { backgroundColor }]}
                disabled={selectedLotteries.length === 0}
            >
                <Text style={styles.text}>Register</Text>
            </TouchableOpacity>
            <LotteryList
                lotteries={lotteries.data}
                loading={lotteries.loading}
                onPress={handleSelect}
                selectedLotteries={selectedLotteries}
                registeredLotteries={registeredLotteries || []}
            />
            <FAB onPress={() => navigation.navigate('AddLottery')} />
        </View>
    </LotteriesSortingContextProvider>
)
```

Thanks to the implementation we have built it just that simple to connect to the context 🎉
</details>

<details>
  <summary><b>Step 4. Create a Header component for the HomeScreen and implement there a button that will control the sorting option</b></summary><br>

  This task we will start from creating a component for the Header. Let’s create then a file inside of components folder called HomeHeader.tsx. Let’s move there existing functionality above the LotteryList component. (Remember to also move used styles). The starting point should look like this:

  ```tsx
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AddLotteryNavigationProp } from '../types';
import { colors } from '../colors';

interface HomeHeaderProps {
    selectedLotteries: string[];
}

export const HomeHeader = ({ selectedLotteries }: HomeHeaderProps) => {
    const navigation = useNavigation<AddLotteryNavigationProp>();

    const backgroundColor =
        selectedLotteries.length === 0 ? colors.grey : colors.secondary;

    return (
        <TouchableOpacity
            accessibilityRole="button"
            onPress={() => navigation.navigate('Register', { selectedLotteries })}
            style={[styles.button, { backgroundColor }]}
            disabled={selectedLotteries.length === 0}
        >
            <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 16,
        top: 8,
        borderRadius: 4,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
    },
    text: {
        color: colors.buttonSecondary,
    },
});
  ```

  And in the area of `Home` component we also have to make some changes to apply newly created component. The return structure of components of the Home component from now one will look like this:

  ```tsx
  return (
    <LotteriesSortingContextProvider>
      <View style={styles.container}>
        <HomeHeader selectedLotteries={selectedLotteries} />
        <LotteryList
          lotteries={lotteries.data}
          loading={lotteries.loading}
          onPress={handleSelect}
          selectedLotteries={selectedLotteries}
          registeredLotteries={registeredLotteries || []}
        />
        <FAB onPress={() => navigation.navigate('AddLottery')} />
      </View>
    </LotteriesSortingContextProvider>
);
  ```

  As a last step we will create `LotteriesSortingButton` which we will position absolutely on the left side of the header similar to the `Register` button. 

  ```tsx
  const LotteriesSortingButton = () => {
    return (
        <TouchableOpacity accessibilityRole="button" style={styles.sortingButton}>
            <Text style={styles.sortingButtonText}>Prices</Text>
            <AntDesign name="arrowup" size={16} color="black" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // ...
    sortingButton: {
        position: 'absolute',
        left: 16,
        top: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    sortingButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 3,
    },
})
  ```
</details>

<details>
  <summary><b>Step 5. Connect the newly created button to the context</b></summary><br>

  First of all let’s get the selectedSorting value in order to display proper arrow in the button related (up or down). We will use AntDesign icon named arrowup or arrowdown. In order to get a value of the context we will use the useLotteriesSortingContext hook: 

```tsx
const LotteriesSortingButton = () => {
  const { selectedSorting } = useLotteriesSortingContext();

  const iconName =
    selectedSorting === LotteryListSortingOptions.Ascending
      ? 'arrowup'
      : 'arrowdown';

  return (
    <TouchableOpacity accessibilityRole="button" style={styles.sortingButton}>
      <Text style={styles.sortingButtonText}>Prices</Text>
      <AntDesign name={iconName} size={16} color="black" />
    </TouchableOpacity>
  );
};
```

Now we just have to connect the switch sorting option method to button so it will trigger the change in the context implementation:

```tsx
const LotteriesSortingButton = () => {
  const { selectedSorting, switchSorting } = useLotteriesSortingContext();

  const iconName =
    selectedSorting === LotteryListSortingOptions.Ascending
      ? 'arrowup'
      : 'arrowdown';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.sortingButton}
      onPress={switchSorting}
    >
      <Text style={styles.sortingButtonText}>Prices</Text>
      <AntDesign name={iconName} size={16} color="black" />
    </TouchableOpacity>
  );
};
```
</details>

<details>
  <summary><b>Step 6. Connect context to the LotteryList and implement sorting functionality</b></summary><br>

  In the final step of this part we just need to get the currently selected sorting option and based on it apply proper sorting to the lotteries list. First of inside of the LotteryList component we have to use useLotteriesSortingContext hook:

  ```ts
  const { selectedSorting } = useLotteriesSortingContext();
  ```

  After that to the filteredLotteries variable we have to apply the sorting after performed filtering: 

  ```ts
    const filteredLotteries = useMemo(
        () =>
            lotteries
                ?.filter((lottery) => lottery.name.includes(filter))
                .sort((a, b) =>
                selectedSorting === LotteryListSortingOptions.Ascending
                    ? Number(a.prize) - Number(b.prize)
                    : Number(b.prize) - Number(a.prize),
                ),
    [filter, lotteries, selectedSorting],
  );
  ```

  And that’s it! 🎉

  > Final version: https://github.com/callstack-workshops/abbott-module-5-homework/tree/part-4
</details>