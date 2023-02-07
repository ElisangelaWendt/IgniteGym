import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes(){

  const {colors} = useTheme()
  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700]
  return(
    // box é usado para qunado for trocar de uma tela para a outra não aparecer a tela branca
    <Box flex={1} bg='gray.700'> 
    <NavigationContainer theme={theme}>
      <AuthRoutes/>
    </NavigationContainer>
    </Box>
  )
}