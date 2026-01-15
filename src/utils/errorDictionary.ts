/**
 * TofuLog Error Dictionary
 * A lightweight knowledge base of common React Native / Expo errors.
 *
 * Each entry provides:
 * - A friendly explanation of what went wrong
 * - A quick tip to fix it
 * - Keywords to match against error messages
 */

export interface ErrorDefinition {
  title: string;
  explanation: string;
  tip: string;
  keywords: string[];
  category: 'network' | 'component' | 'navigation' | 'state' | 'native' | 'build' | 'general';
}

export const ERROR_DICTIONARY: ErrorDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // NETWORK ERRORS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    title: 'Network Request Failed',
    explanation: 'Your app cannot reach the server. This usually means the device has no internet or the server is down.',
    tip: 'Check if your phone and laptop are on the same WiFi. If using localhost, try your computer\'s IP address instead.',
    keywords: ['network request failed', 'fetch failed', 'networkerror'],
    category: 'network',
  },
  {
    title: 'CORS Error',
    explanation: 'The server is blocking requests from your app due to Cross-Origin Resource Sharing rules.',
    tip: 'This usually happens in web/remote debugging. Add CORS headers to your server or use a proxy.',
    keywords: ['cors', 'cross-origin', 'access-control-allow-origin'],
    category: 'network',
  },
  {
    title: 'Timeout Error',
    explanation: 'The request took too long and was cancelled.',
    tip: 'Check your internet connection. If the server is slow, consider increasing the timeout value.',
    keywords: ['timeout', 'timed out', 'econnaborted'],
    category: 'network',
  },
  {
    title: 'SSL/Certificate Error',
    explanation: 'The server\'s SSL certificate is invalid or not trusted.',
    tip: 'In development, you may need to allow insecure connections. In production, fix your SSL certificate.',
    keywords: ['ssl', 'certificate', 'cert', 'https', 'unable to verify'],
    category: 'network',
  },
  {
    title: '401 Unauthorized',
    explanation: 'The server rejected your request because you\'re not authenticated.',
    tip: 'Check if your auth token is valid and not expired. You may need to refresh it or log in again.',
    keywords: ['401', 'unauthorized', 'authentication'],
    category: 'network',
  },
  {
    title: '403 Forbidden',
    explanation: 'You\'re authenticated but don\'t have permission to access this resource.',
    tip: 'Check user roles/permissions. The logged-in user may not have access to this endpoint.',
    keywords: ['403', 'forbidden', 'permission denied'],
    category: 'network',
  },
  {
    title: '404 Not Found',
    explanation: 'The requested resource doesn\'t exist on the server.',
    tip: 'Double-check the URL. The endpoint may have changed or the resource was deleted.',
    keywords: ['404', 'not found'],
    category: 'network',
  },
  {
    title: '500 Server Error',
    explanation: 'Something crashed on the server side.',
    tip: 'This is a backend issue. Check your server logs for the actual error.',
    keywords: ['500', 'internal server error', 'server error'],
    category: 'network',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // COMPONENT ERRORS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    title: 'Cannot Read Property of Undefined',
    explanation: 'You\'re trying to access a property on something that doesn\'t exist yet.',
    tip: 'Use optional chaining (obj?.property) or check if the value exists before accessing it.',
    keywords: ['cannot read property', 'undefined is not an object', 'null is not an object'],
    category: 'component',
  },
  {
    title: 'Invalid Hook Call',
    explanation: 'React hooks are being called incorrectly - either outside a component or in the wrong order.',
    tip: 'Hooks must be called at the top level of a function component, not inside loops, conditions, or nested functions.',
    keywords: ['invalid hook call', 'hooks can only be called', 'rules of hooks'],
    category: 'component',
  },
  {
    title: 'Too Many Re-renders',
    explanation: 'Your component is stuck in an infinite render loop.',
    tip: 'Check for setState calls in the render body. Wrap them in useEffect or event handlers.',
    keywords: ['too many re-renders', 'maximum update depth exceeded', 'infinite loop'],
    category: 'component',
  },
  {
    title: 'Each Child Should Have a Unique Key',
    explanation: 'When rendering lists, React needs a unique "key" prop to track items efficiently.',
    tip: 'Add a unique key prop to each item. Use item.id if available, avoid using array index.',
    keywords: ['unique key', 'key prop', 'each child in a list'],
    category: 'component',
  },
  {
    title: 'Text Strings Must Be Wrapped',
    explanation: 'In React Native, raw text must be inside a <Text> component.',
    tip: 'Wrap your string in <Text>your text</Text>. This is different from web React.',
    keywords: ['text strings must be rendered', 'rawtext', 'text outside of'],
    category: 'component',
  },
  {
    title: 'VirtualizedList Nesting Warning',
    explanation: 'You have a scrollable list inside another scrollable container.',
    tip: 'Use ListHeaderComponent/ListFooterComponent instead of nesting, or set scrollEnabled={false} on the inner list.',
    keywords: ['virtualizedlist', 'nested', 'same orientation'],
    category: 'component',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // NAVIGATION ERRORS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    title: 'Navigation Container Not Found',
    explanation: 'You\'re trying to navigate but there\'s no NavigationContainer wrapping your app.',
    tip: 'Make sure your App component is wrapped in <NavigationContainer>.',
    keywords: ['navigationcontainer', 'couldn\'t find a navigation object', 'navigation context'],
    category: 'navigation',
  },
  {
    title: 'Screen Not Found',
    explanation: 'You\'re trying to navigate to a screen that doesn\'t exist in your navigator.',
    tip: 'Check the screen name for typos. Make sure the screen is registered in your navigator.',
    keywords: ['couldn\'t find a screen', 'screen doesn\'t exist', 'no route'],
    category: 'navigation',
  },
  {
    title: 'Params Not Passed',
    explanation: 'The screen expected parameters but didn\'t receive them.',
    tip: 'Pass params when navigating: navigation.navigate(\'Screen\', { id: 123 })',
    keywords: ['params', 'route.params', 'undefined params'],
    category: 'navigation',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT ERRORS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    title: 'State Update on Unmounted Component',
    explanation: 'You\'re trying to update state after the component has been removed from the screen.',
    tip: 'Cancel async operations in useEffect cleanup, or check if component is still mounted.',
    keywords: ['can\'t perform a react state update', 'unmounted component', 'memory leak'],
    category: 'state',
  },
  {
    title: 'Mutating State Directly',
    explanation: 'You\'re changing state directly instead of using setState.',
    tip: 'Never modify state directly. Use setState or the setter from useState.',
    keywords: ['mutate', 'directly modify', 'state mutation'],
    category: 'state',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // NATIVE MODULE ERRORS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    title: 'Native Module Not Found',
    explanation: 'A native module is missing. This often happens when native code isn\'t linked properly.',
    tip: 'Run "npx pod-install" for iOS or rebuild the app. Some packages need a dev build, not Expo Go.',
    keywords: ['native module', 'turbomodule', 'cannot find native module', 'null is not an object'],
    category: 'native',
  },
  {
    title: 'Invariant Violation',
    explanation: 'A core assumption in React Native was violated. This is usually a serious error.',
    tip: 'Read the full error message carefully. This often points to a native module or configuration issue.',
    keywords: ['invariant violation', 'invariant'],
    category: 'native',
  },
  {
    title: 'Metro Bundler Error',
    explanation: 'The JavaScript bundler encountered an error while building your code.',
    tip: 'Check for syntax errors in recent changes. Try clearing the cache: npx expo start -c',
    keywords: ['metro', 'bundler', 'bundle failed', 'transform error'],
    category: 'build',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPO-SPECIFIC ERRORS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    title: 'Expo Go Limitation',
    explanation: 'This feature requires custom native code and won\'t work in Expo Go.',
    tip: 'Create a development build with "npx expo run:ios" or "npx expo run:android".',
    keywords: ['expo go', 'development build', 'custom native code', 'not available'],
    category: 'native',
  },
  {
    title: 'Asset Not Found',
    explanation: 'An image or file you\'re trying to load doesn\'t exist.',
    tip: 'Check the file path. Use require() for local assets or verify the URL for remote ones.',
    keywords: ['asset', 'image', 'could not find', 'unable to resolve'],
    category: 'general',
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GENERAL JAVASCRIPT ERRORS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    title: 'Syntax Error',
    explanation: 'There\'s a typo or syntax mistake in your code.',
    tip: 'Check the line number in the error. Look for missing brackets, commas, or quotes.',
    keywords: ['syntaxerror', 'unexpected token', 'unexpected identifier'],
    category: 'general',
  },
  {
    title: 'Type Error',
    explanation: 'You\'re using a value in a way that doesn\'t match its type.',
    tip: 'Check if the variable is the type you expect. It might be undefined or a different type.',
    keywords: ['typeerror', 'is not a function', 'is not iterable'],
    category: 'general',
  },
  {
    title: 'Reference Error',
    explanation: 'You\'re using a variable that hasn\'t been defined.',
    tip: 'Check for typos in variable names. Make sure it\'s imported or declared before use.',
    keywords: ['referenceerror', 'is not defined'],
    category: 'general',
  },
  {
    title: 'JSON Parse Error',
    explanation: 'The string you\'re trying to parse isn\'t valid JSON.',
    tip: 'Log the raw string before parsing. The server might be returning HTML or an error message.',
    keywords: ['json', 'parse', 'unexpected token', 'json.parse'],
    category: 'general',
  },
];

/**
 * Find a matching error definition based on the error message.
 * Returns the first match or undefined if no match found.
 */
export function findErrorDefinition(errorMessage: string): ErrorDefinition | undefined {
  const lowerMessage = errorMessage.toLowerCase();

  for (const definition of ERROR_DICTIONARY) {
    for (const keyword of definition.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return definition;
      }
    }
  }

  return undefined;
}

/**
 * Get all error definitions for a specific category.
 */
export function getErrorsByCategory(category: ErrorDefinition['category']): ErrorDefinition[] {
  return ERROR_DICTIONARY.filter((def) => def.category === category);
}
