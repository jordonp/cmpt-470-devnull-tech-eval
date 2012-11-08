module SessionsHelper
  def sign_in(user)
    cookies.permanent[:remember_token] = user.remember_token
    self.current_user = user
  end

  def sign_out
    self.current_user = nil
    cookies.delete(:remember_token)
  end

  def signed_in?
    !current_user.nil?
  end
  
  def current_user=(user)
    @current_user = user
  end
  
  def current_user
    @current_user ||= User.find_by_remember_token(cookies[:remember_token])
  end

  #signed_in? && current_user.enabled? && !current_user.client_connect_user?
  def authorized?(action=nil, resource=nil, *args)
    signed_in?
  end

  def sign_in_required
    authorized? || access_rejected
  end

  def access_rejected
    respond_to do |format|
      format.html do
        redirect_to new_session_path
      end
    end
    return false
  end
end
