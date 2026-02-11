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
        backgroundColor: Colors.light.background,
        shadowColor: Colors.light.shadow,
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
        backgroundColor: Colors.light.background
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
        backgroundColor: Colors.light.surface,
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

    //EventFrom
    //EditUserInfo
    addButton: {
        alignItems: "center",
        backgroundColor: Colors.light.secondary,
        padding: 12,
        borderRadius: 5,
    },
    input: {
        width: '100%',
        backgroundColor: Colors.light.surface,
        borderColor: Colors.light.outline,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: Colors.light.onSurface,
    },

    //JoinEventButton
    //EventFrom
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
        color: Colors.light.onSecondaryContainer,
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
        color: Colors.light.onSurface,
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
        color: Colors.light.onSurface,
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
        color: Colors.light.onSurface,
    },

    //EventForm
    //EventInfoScreen
    //UpdateEventScreen
    helperText: {
        color: Colors.light.error,
        fontSize: 12,
    },

    //EventForm
    //AllEventsMapView
    //EditUserInfo
    label: {
        fontWeight: "600",
        color: Colors.light.onSurface,
    },

    //EventInfoScreen
    organizerLink: {
        fontSize: 16,
        padding: 5,
        color: Colors.light.inversePrimary
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
        color: Colors.light.inversePrimary,
        marginTop: 8,
    },

    //ExpandableListCard
    noEventsText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: Colors.light.onSurfaceVariant,
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
    },
    hobbyInputContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    hobbyInput: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: Colors.light.surface,
        borderColor: Colors.light.outline,
        padding: 10,
        borderRadius: 5,
        fontSize: 14,
        color: Colors.light.onSurface,
    },
    hobbyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.light.surfaceVariant,
        padding: 10,
        borderRadius: 5,
        marginBottom: 8,
    },
    deleteButton: {
        padding: 5,
    },
    deleteButtonText: {
        fontSize: 24,
        color: Colors.light.error
    },
    buttonSave: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
        backgroundColor: Colors.light.secondary,
    },
    buttonCancel: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
        backgroundColor: Colors.light.error,
    },
    buttonDisabled: {
        opacity: 0.6,
    },

    //EditUserInfo
    //ShowUserInfo
    hobbyText: {
        fontSize: 14,
        flex: 1,
        color: Colors.light.onSurfaceVariant,
    },

    //ShowUserInfo
    hobbiesTable: {
        marginVertical: 5,
    },
    hobbyRow: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.outline,
        backgroundColor: Colors.light.surface,
    },
    showUserContainer: {
        flex: 1,
        paddingVertical: 10,
        marginTop: 20,
        backgroundColor: Colors.light.surface,
    },

    //LogOutButton
    logOutButton: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
        backgroundColor: Colors.light.secondary,
    },
    logOutButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.light.onSecondaryContainer,
    },

    // Additional light theme specific styles
    text: {
        color: Colors.light.onSurface,
    },
    textSecondary: {
        color: Colors.light.onSurfaceVariant,
    },
    surface: {
        backgroundColor: Colors.light.surface,
    },
    surfaceVariant: {
        backgroundColor: Colors.light.surfaceVariant,
    },
})

export default globalStyles