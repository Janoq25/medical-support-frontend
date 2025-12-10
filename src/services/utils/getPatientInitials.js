export const getPatientInitials = (name, lastname) => {
    if(!name && !lastname) return '';
    if(!name) return lastname[0].toUpperCase();
    if(!lastname) return name[0].toUpperCase();
    return `${name[0].toUpperCase()}${lastname[0].toUpperCase()}`;
}