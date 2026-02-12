import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const globalStyles = StyleSheet.create({

    //AttendeeInfoModeal
    //ShowUserInfo
    //EventInfoScreen
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
        shadowColor: Colors.dark.shadow,
        margin: 8,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 24,
    },

    //CreateEvemtScreen
    //HomeScreen
    //ProfileScreen
    //UpdateEventScreen
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background
    },
    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },

    //ExpandableListCard
    //EventFrom
    //AttendeeInfoModal
    //AllEventMapView
    //EventInfoScreen
    cardContainer: {
        alignContent: 'flex-start',
        width: '100%',
        backgroundColor: Colors.dark.elevation.level1,
        marginBlockStart: 20,
        marginBlockEnd: 10
    },

    //EventFrom
    cardContent: {
        gap: 12,
    },
    multiline: {
        textAlignVertical: "top",
        minHeight: 80,
    },

    //JoinEventButton
    //AttendeeInfoModal
    //ShowUserInfo
    //EventInfoScreen
    buttonText: {
        fontWeight: "bold",
        alignItems: "center",
        padding: 12,
        marginVertical: 10,
        borderRadius: 10,
        fontSize: 16,
        color: Colors.dark.primary,
    },

    //EventFrom
    //EditUserInfo
    addButton: {
        alignItems: "center",
        padding: 12,
        borderRadius: 5,
        backgroundColor: Colors.dark.secondaryContainer,
    },
        addEventButtonText: {
        fontWeight: "bold",
        alignItems: "center",
        padding: 12,
        marginVertical: 10,
        borderRadius: 10,
        fontSize: 16,
        color: Colors.dark.secondary,
    },
    input: {
        width: '100%',
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primaryContainer,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: Colors.dark.surface,
    },

    //EventFrom
    //RecentEventsList
    //ShowUsersEvents
    EventFormContainer: {
        width: "100%",
        padding: 16,
        gap: 16,
    },

    //ExpandableListCard
    //EventForm
    //AttendeeInfoModal
    //EditUserInfo
    //ShowUserInfo
    //EventInfoScreen
    heading: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
        color: Colors.dark.onSurface,
    },

    //ExpandableListCard
    //AllEventsMapView
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    //ExpandableListCard
    //AttendeeInfoModal
    //EventInfoScreen
    basicInfoView: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        margin: 2,
    },

    //AttendeeInfoModal
    //EventInfoScreen
    descriptionView: {
        width: "95%",
        margin: 8,
    },

    //SigleEventRow
    singleEventView: {
        width: '100%',
        marginTop: 8,
    },

    //SingleEventRow
    //AttendeeInfoRow
    //EditUserInfo
    subHeading: {
        fontWeight: 'bold',
        fontSize: 16,
        padding: 5,
        color: Colors.dark.onSurface,
    },

    //JoinEventButton
    //AttendeeInfoModal
    //ShowUserInfo
    //EventInfoScreen
    textPressed: {
        opacity: 0.6,
    },

    //SingleEventRow
    //AttendeeInfoModal
    //ShowUserInfo
    //EventInfoScreen
    infoText: {
        fontSize: 16,
        padding: 5,
        color: Colors.dark.onSurface,
    },

    //EventForm
    //EventInfoScreen
    //UpdateEventScreen
    helperText: {
        color: Colors.dark.error,
        fontSize: 12,
    },

    //EventForm
    //AllEventsMapView
    //EditUserInfo
    label: {
        fontWeight: "600",
        color: Colors.dark.onSurface,
    },

    //EventInfoScreen
    organizerLink: {
        fontSize: 16,
        padding: 5,
        color: Colors.dark.inversePrimary
    },
    pressableView: {
        flexDirection: "row",
        gap: 32,
    },

    //EventInfoScreen
    //UpdateEventScreen
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
    },

    //UpdateEventScreen
    linkText: {
        color: Colors.dark.inversePrimary,
        marginTop: 8,
    },

    //ExpandableListCard
    noEventsText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: Colors.dark.onSurfaceVariant,
    },

    //AllEventsMapView
    filtersView: {
        width: '95%',
        justifyContent: 'space-evenly',
        flex: 1,
        margin: 8
    },
    mapContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxHeight: 300,
        margin: 8,
        padding: 8,
    },

    //MapAllEvents
    mapAllEvents: {
        width: '100%',
        height: '100%',
        margin: 8
    },

    //LocationFields
    fieldGroup: {
        gap: 12,
    },

    //EditUserInfo
    editUserContainer: {
        flex: 1,
        gap: 5,
        padding: 20,
        marginTop: 20,
        backgroundColor: Colors.dark.background
    },
    hobbyInputContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    hobbyInput: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primaryContainer,
        padding: 10,
        borderRadius: 5,
        fontSize: 14,
        color: Colors.dark.onSecondaryContainer,
    },
    hobbyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.dark.surfaceVariant,
        padding: 10,
        borderRadius: 5,
        marginBottom: 8,
    },
    deleteButton: {
        padding: 5,
    },
    deleteButtonText: {
        fontSize: 24,
        color: Colors.dark.errorContainer
    },
    buttonSave: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
        backgroundColor: Colors.dark.secondaryContainer,
    },
    buttonSaveText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.dark.secondary,
    },

    buttonCancel: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
        backgroundColor: Colors.dark.onError,
    },
    buttonDisabled: {
        opacity: 0.6,
    },

    //EditUserInfo
    //ShowUserInfo
    hobbyText: {
        fontSize: 14,
        flex: 1,
        color: Colors.dark.onSurfaceVariant,
    },

    //ShowUserInfo
    hobbiesTable: {
        marginVertical: 5,
    },
    hobbyRow: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.outline,
        backgroundColor: Colors.dark.elevation.level5,
    },
    showUserContainer: {
        flex: 1,
        paddingVertical: 10,
        marginTop: 20,
        margin: 16,
        backgroundColor: Colors.dark.elevation.level1,
    },

    //LogOutButton
    logOutButton: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
        backgroundColor: Colors.dark.onError,
    },
    logOutButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.dark.onErrorContainer,
    },

    // Additional dark theme specific styles
    text: {
        color: Colors.dark.onSurface,
    },
    textSecondary: {
        color: Colors.dark.onSurfaceVariant,
    },
    surface: {
        backgroundColor: Colors.dark.surface,
    },
    surfaceVariant: {
        backgroundColor: Colors.dark.surfaceVariant,
    },
})

export default globalStyles